import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import PropTypes from 'prop-types';

import * as d3 from 'd3';

import { setActiveElement } from '../../actions/graphs';
import { denormalizeCoords } from '../../func';
import config from '../../config';

const Link = ({ link_id }) => {
  const link = useSelector((state) => state.graph.graph.data.links[link_id], shallowEqual);
  const linkType = useSelector((state) => (link.type ? state.graph.graph.model.link_types[link.type] : ''), shallowEqual);
  const positionSource = (
    useSelector((s) => s.graph.graph.visualization.node_positions[link.source], shallowEqual)
  );
  const positionTarget = (
    useSelector((s) => s.graph.graph.visualization.node_positions[link.target], shallowEqual)
  );
  const dispatch = useDispatch();
  // const type = useSelector((state) => state.graph.graph.model.link_types[link.type]);

  const myRef = useRef(null);

  useEffect(() => {
    const source = denormalizeCoords(positionSource.x, positionSource.y);
    const target = denormalizeCoords(positionTarget.x, positionTarget.y);

    let endPoint = target;
    const visibleLineStyle = {
      stroke: config.DEFAULT_LINK_COLOR,
      'marker-end': 'none',
    };

    if (link.type) {
      if (linkType.directed) {
        const difference = { x: target.x - source.x, y: target.y - source.y };
        const distance = Math.sqrt(difference.x ** 2 + difference.y ** 2);
        const scaling = (distance - config.DISTANCE_FROM_ARROW_END_TO_NODE_CENTER) / distance;
        visibleLineStyle['marker-end'] = 'url(#arrowhead)';
        endPoint = { x: source.x + difference.x * scaling, y: source.y + difference.y * scaling };
      }
      if (linkType.color) {
        visibleLineStyle.stroke = linkType.color;
      }
    }
    d3.select(myRef.current)
      .selectAll('line')
      .attr('x1', source.x)
      .attr('y1', source.y)
      .attr('x2', endPoint.x)
      .attr('y2', endPoint.y);
    d3.select(myRef.current)
      .select('.line_hoverarea')
      .on('click', () => {
        d3.event.stopImmediatePropagation();
        dispatch(setActiveElement({ id: link_id, type: 'link' }));
      });
    const visibleLine = d3.select(myRef.current).select('.line_visible');
    Object.entries(visibleLineStyle).forEach(([prop, val]) => visibleLine.style(prop, val));
  }, [positionSource, positionTarget, linkType, link]);

  return (
    <g ref={myRef} id={`link_${link_id}`}>
      <line className="line_hoverarea" />
      <line className="line_visible" />
    </g>
  );
};

Link.propTypes = {
  link_id: PropTypes.string.isRequired,
};

export default Link;
