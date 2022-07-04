import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';

import * as d3 from 'd3';
import { v4 as uuid } from 'uuid';

import Node from './Node';
import Link from './Link';

import { createNode, updateZoom, selectElements } from '../../actions/graphs';
import { normalizeCoords } from '../../func';
import RubberBand from './RubberBand';
import Toolbar from '../common/Toolbar';

const GraphViewer = () => {
  const dispatch = useDispatch();
  const myRef = useRef();
  const defaultNodeType = useSelector((state) => state.graph.defaultNodeType);
  const visualization = useSelector((state) => state.graph.graph.visualization, shallowEqual);
  const nodeTypes = useSelector((state) => Object.keys(state.graph.graph.data.nodes).reduce(
    (dict, el) => (dict[el] = state.graph.graph.data.nodes[el].type, dict),
    {},
  ), shallowEqual);

  //     v this dictionary stores [type, source, target] of the links
  const linkTypes = useSelector((state) => Object.keys(state.graph.graph.data.links).reduce(
    (dict, el) => (dict[el] = state.graph.graph.data.links[el].type, dict),
    {},
  ), shallowEqual);
  const linkSources = useSelector((state) => Object.keys(state.graph.graph.data.links).reduce(
    (dict, el) => (dict[el] = state.graph.graph.data.links[el].source, dict),
    {},
  ), shallowEqual);
  const linkTargets = useSelector((state) => Object.keys(state.graph.graph.data.links).reduce(
    (dict, el) => (dict[el] = state.graph.graph.data.links[el].target, dict),
    {},
  ), shallowEqual);

  const visibleNodes = Object.keys(nodeTypes).filter(
    (id) => nodeTypes[id] === '' || !visualization.node_types_filtered[nodeTypes[id]],
  );

  const visibleLinks = Object.keys(linkTypes).filter(
    (id) => (linkTypes[id] === '' || !visualization.link_types_filtered[linkTypes[id]])
      && visibleNodes.indexOf(linkSources[id]) > -1
      && visibleNodes.indexOf(linkTargets[id]) > -1,
  );

  // zoom behavior and dblclick to create node, updated when defaultNodeType changes
  useEffect(() => {
    const svg = d3.select('#graph_container');
    const svg_g = svg.select('#nodes_and_links');

    const zoom_behavior = d3.zoom()
      .scaleExtent([0.2, 5]).filter(() => d3.event.button === 1 || d3.event.type === 'wheel').clickDistance(5)
      .on('zoom', () => {
        svg_g.attr('transform', d3.event.transform);
      });
    /* its probably not necessary to update the state on each zoom, this could be saved somehow else
    .on('end', () => {
      dispatch(updateZoom(d3.event.transform));
    }); */

    svg.call(zoom_behavior)
      .on('dblclick.zoom', null)
      .on('click', () => {
        dispatch(selectElements({ ids: [], type: 'none' }));
      }).on('dblclick', () => {
        const id = uuid();
        const zoomTransform = d3.zoomTransform(svg.node());
        const { x, y } = normalizeCoords(
          zoomTransform.invertX(d3.event.offsetX),
          zoomTransform.invertY(d3.event.offsetY),
        );
        dispatch(createNode({ id, data: { name: '', type: defaultNodeType }, position: { x, y } }));
        setTimeout(() => { d3.select(`#node_${id}`).dispatch('dblclick'); }, 30);
      });

    if (visualization.zoom !== undefined) {
      const { zoom } = visualization;
      svg.call(zoom_behavior.transform, d3.zoomIdentity.translate(zoom.x, zoom.y).scale(zoom.k));
    }
  }, [defaultNodeType]);

  return (
    <>
      <div ref={myRef} className="comp">
        <svg id="graph_container" width="100%" height="100%">
          <defs>
            <marker
              id="arrowhead"
              markerWidth="16"
              markerHeight="9"
              refX="0"
              refY="4.5"
              orient="auto"
              fill="none"
              stroke="black"
              strokeLinejoin="round"
              strokeWidth="1"
              markerUnits="userSpaceOnUse"
            >
              <polygon points="1 1, 15 4.5, 1 8" />
            </marker>
          </defs>
          <g id="nodes_and_links">
            <g className="nodes">
              { visibleNodes.map((node_id) => (
                <Node key={node_id} node_id={node_id} />
              ))}
            </g>
            <g className="links">
              { visibleLinks.map((link_id) => (
                <Link key={link_id} link_id={link_id} />
              ))}
            </g>
          </g>
          <RubberBand />
        </svg>
      </div>
    </>
  );
};

export default GraphViewer;
