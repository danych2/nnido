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

export const updateLinkPositionSimple = (link_id) => {
  const state = store.getState();
  const link = state.graph.graph.data.links[link_id];
  const positionSource = state.graph.graph.visualization.node_positions[link.source];
  const positionTarget = state.graph.graph.visualization.node_positions[link.target];
  const sourceSize = state.graph.graph.data.nodes[link.source].dims;
  const targetSize = state.graph.graph.data.nodes[link.target].dims;
  const source = denormalizeCoords(positionSource.x, positionSource.y);
  const target = denormalizeCoords(positionTarget.x, positionTarget.y);
  const directed = getSystemProperty(state.graph.graph, link_id, 'directed', 'link');
  updateLinkPosition(link_id, source, target, sourceSize, targetSize, directed);
};

const updateLinkPosition = (link_id, source, target, sourceSize, targetSize, directed) => {
  // calculate link direction
  const difference = { x: target.x - source.x, y: target.y - source.y };
  const angle = Math.atan2(difference.y, difference.x);
  const offset = [0, 0]; // HORIZONTAL, VERTICAL
  if (Math.abs(angle) < Math.PI * 0.25) {
    offset[0] = -1;
  } else if (Math.abs(angle) > Math.PI * 0.75) {
    offset[0] = 1;
  } else if (angle > 0) {
    offset[1] = -1;
  } else {
    offset[1] = 1;
  }

  const startPoint = {
    x: source.x + offset[0] * -(sourceSize.width / 2 + config.PADDING_TEXT_NODE),
    y: source.y + offset[1] * -(sourceSize.height / 2 + config.PADDING_TEXT_NODE),
  };
  let endPoint = {
    x: target.x + offset[0] * (targetSize.width / 2 + config.PADDING_TEXT_NODE),
    y: target.y + offset[1] * (targetSize.height / 2 + config.PADDING_TEXT_NODE),
  };

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

export default Link;
