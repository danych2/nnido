import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import PropTypes from 'prop-types';

import * as d3 from 'd3';

import { selectElements } from '../../actions/graphs';
import { denormalizeCoords, getSystemProperty } from '../../func';
import config from '../../config';
import store from '../../store';

const Link = ({ link_id }) => {
  const link = useSelector((state) => state.graph.graph.data.links[link_id], shallowEqual);
  const linkType = useSelector((state) => (link.type ? state.graph.graph.model.link_types[link.type] : ''), shallowEqual);
  const positionSource = (
    useSelector((s) => s.graph.graph.visualization.node_positions[link.source], shallowEqual)
  );
  const positionTarget = (
    useSelector((s) => s.graph.graph.visualization.node_positions[link.target], shallowEqual)
  );
  const sourceSize = (
    useSelector((s) => s.graph.graph.data.nodes[link.source].dims, shallowEqual)
  );
  const targetSize = (
    useSelector((s) => s.graph.graph.data.nodes[link.target].dims, shallowEqual)
  );
  const dispatch = useDispatch();
  // const type = useSelector((state) => state.graph.graph.model.link_types[link.type]);

  const myRef = useRef(null);

  const selection = useSelector((state) => state.graph.selection);
  const isSelected = selection.ids.includes(link_id);

  const selectionAdjacent = useSelector((state) => state.graph.selectionAdjacent);
  const isAdjacentToSelected = selectionAdjacent.link_ids.includes(link_id);

  const color = useSelector((state) => getSystemProperty(state.graph.graph, link_id, 'color_link', 'link'), shallowEqual);
  const directed = useSelector((state) => getSystemProperty(state.graph.graph, link_id, 'directed', 'link'), shallowEqual);

  useEffect(() => {
    const source = denormalizeCoords(positionSource.x, positionSource.y);
    const target = denormalizeCoords(positionTarget.x, positionTarget.y);

    updateLinkPosition(link_id, source, target, sourceSize, targetSize, directed);

    const visibleLineStyle = {
      'marker-end': 'none',
      stroke: config.DEFAULT_NODE_COLOR,
    };

    if (directed) {
      visibleLineStyle['marker-end'] = 'url(#arrowhead)';
    }

    if (color) {
      visibleLineStyle.stroke = color;
    }

    d3.select(myRef.current)
      .selectAll('line')
      .on('click', () => {
        d3.event.stopImmediatePropagation();
        dispatch(selectElements({ ids: [link_id], type: 'link' }));
      });
    const visibleLine = d3.select(myRef.current).select('.line_visible');
    Object.entries(visibleLineStyle).forEach(([prop, val]) => visibleLine.style(prop, val));
  }, [positionSource, positionTarget, sourceSize, targetSize, linkType, link]);

  return (
    <g ref={myRef} id={`link_${link_id}`}>
      <line className="line_shadow" visibility={isSelected ? 'visible' : 'hidden'} />
      <line className="line_hoverarea" />
      <line className="line_visible" />
      <line className="line_adjacent_shadow" visibility={isAdjacentToSelected ? 'visible' : 'hidden'} />
    </g>
  );
};

Link.propTypes = {
  link_id: PropTypes.string.isRequired,
};

export const updateLinkPositionSimple = (link_id, new_source, new_target) => {
  const state = store.getState();
  const link = state.graph.graph.data.links[link_id];
  const positionSource = new_source || state.graph.graph.visualization.node_positions[link.source];
  const positionTarget = new_target || state.graph.graph.visualization.node_positions[link.target];
  const sourceSize = state.graph.graph.data.nodes[link.source].dims;
  const targetSize = state.graph.graph.data.nodes[link.target].dims;
  const source = denormalizeCoords(positionSource.x, positionSource.y);
  const target = denormalizeCoords(positionTarget.x, positionTarget.y);
  const directed = getSystemProperty(state.graph.graph, link_id, 'directed', 'link');
  updateLinkPosition(link_id, source, target, sourceSize, targetSize, directed);
};

const updateLinkPosition = (link_id, source, target, sourceSize, targetSize, directed) => {
  const startPoint = getCrossPoint(source, target,
    (sourceSize.width / 2 + config.PADDING_TEXT_NODE),
    (sourceSize.height / 2 + config.PADDING_TEXT_NODE));

  let endPoint = getCrossPoint(target, source,
    (targetSize.width / 2 + config.PADDING_TEXT_NODE),
    (targetSize.height / 2 + config.PADDING_TEXT_NODE));

  if (directed) {
    const difference = { x: endPoint.x - source.x, y: endPoint.y - source.y };
    const distance = Math.sqrt(difference.x ** 2 + difference.y ** 2);
    const scaling = (distance - config.DISTANCE_FROM_ARROW_END_TO_NODE_CENTER) / distance;
    endPoint = { x: source.x + difference.x * scaling, y: source.y + difference.y * scaling };
  }

  d3.select(`#link_${link_id}`)
    .selectAll('line')
    .attr('x1', startPoint.x)
    .attr('y1', startPoint.y)
    .attr('x2', endPoint.x)
    .attr('y2', endPoint.y);
};

const getCrossPoint = (thisCenter, thatCenter, halfWidth, halfHeight) => {
  const difference = { x: thatCenter.x - thisCenter.x, y: thatCenter.y - thisCenter.y };

  // Compute line between centers of nodes and its quadrant y = mx+c
  const m = difference.y / difference.x;
  const c = thisCenter.y - thisCenter.x * m;
  const angle = Math.atan2(difference.y, difference.x);
  const quadrant = [1, 1];
  // (+,+)->quadrant I, (-,+)-> quadrant II, (-,-)-> quadrant III, (+,-)->quadrant IV
  if (Math.abs(angle) < Math.PI / 2) quadrant[0] = -1;
  if (angle < 0) quadrant[1] = -1;

  // Find source cross point
  // Which corner is the closest to the crossing?
  const vertiEdge = thisCenter.x + quadrant[0] * -halfWidth;
  const horiEdge = thisCenter.y + quadrant[1] * halfHeight;
  const angleStartCorner = Math.atan2(horiEdge - thisCenter.y, vertiEdge - thisCenter.x);

  // whichSide: true -> vertical side, false -> horizontal side
  const halfPI = Math.PI / 2;
  const whichSide = Math.abs(Math.abs(angle) - halfPI)
    > Math.abs(Math.abs(angleStartCorner) - halfPI);

  return {
    x: whichSide * vertiEdge + !whichSide * ((horiEdge - c) / m),
    y: whichSide * (vertiEdge * m + c) + !whichSide * horiEdge,
  };
};

export default Link;
