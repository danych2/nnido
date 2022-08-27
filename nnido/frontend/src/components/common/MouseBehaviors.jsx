import * as d3 from 'd3';
import {
  normalizeCoords, denormalizeCoords, dictFilter,
} from '../../func';
import {
  updateNodePosition, updateNodesPositions, createLink,
} from '../../actions/graphs';
import store from '../../store';
import { updateLinkPositionSimple } from '../view/Link';

export default function createNodeDragBehavior(
  node_id,
  dispatch,
  myRef,
) {
  return d3.drag()
    .filter(() => !d3.event.button)
    .subject((d) => {
      let creatingLink = false;
      if (d3.event.sourceEvent.ctrlKey) {
        creatingLink = true;
        return { creatingLink };
      }
      const state = store.getState();
      const { selection } = state.graph;
      const nodesToMove = selection.ids.includes(node_id) ? selection.ids : [node_id];

      const linksInOut = [];
      const linksIn = [];
      const linksOut = [];
      Object.keys(state.graph.graph.data.links).forEach((link_id) => {
        const link = state.graph.graph.data.links[link_id];
        let incoming = false;
        if (nodesToMove.includes(link.target)) incoming = true;
        if (nodesToMove.includes(link.source)) {
          if (incoming) linksInOut.push(link_id);
          else linksOut.push(link_id);
        } else if (incoming) linksIn.push(link_id);
      });
      const nodesPositions = {};
      nodesToMove.forEach((id) => {
        nodesPositions[id] = state.graph.graph.visualization.node_positions[id];
      });
      return {
        creatingLink, nodesPositions, linksIn, linksOut, linksInOut, hasMoved: false,
      };
    })
    .on('start', (d) => {
      if (d3.event.subject.creatingLink) {
        const currentPos = store.getState().graph.graph.visualization.node_positions[node_id];
        const { x: currentX, y: currentY } = denormalizeCoords(currentPos.x, currentPos.y);
        d3.select(myRef.current.parentNode).insert('line', ':first-child')
          .attr('class', 'creating_link')
          .attr('x1', currentX)
          .attr('y1', currentY)
          .attr('x2', currentX)
          .attr('y2', currentY);
      }
    })
    .on('drag', (d) => {
      if (d3.event.subject.creatingLink) {
        d3.select(myRef.current.parentNode).select('line')
          .attr('x2', d3.event.x).attr('y2', d3.event.y);
      } else {
        d3.event.subject.hasMoved = true;
        const {
          nodesPositions, linksIn, linksOut, linksInOut,
        } = d3.event.subject;
        Object.keys(nodesPositions).forEach((id) => {
          const old_position = denormalizeCoords(nodesPositions[id].x, nodesPositions[id].y);
          const new_position = { x: old_position.x + d3.event.dx, y: old_position.y + d3.event.dy };
          d3.select(`#node_${id}`)
            .attr('transform', `translate(${new_position.x}, ${new_position.y})`);
          nodesPositions[id] = normalizeCoords(new_position.x, new_position.y);
        });
        updateLinksPositions(nodesPositions, linksIn, linksOut, linksInOut);
      }
    })
    .on('end', (d) => {
      if (d3.event.subject.creatingLink) {
        const targetRect = document
          .elementsFromPoint(d3.event.sourceEvent.x, d3.event.sourceEvent.y)
          .find((x) => x.nodeName === 'rect');
        if (targetRect !== undefined) {
          const target_node_name = targetRect.parentNode.id.slice(5);
          if (target_node_name !== node_id) {
            dispatch(createLink({
              source: node_id,
              target: target_node_name,
              type: store.getState().graph.defaultLinkType,
            }));
          }
        }
        d3.select(myRef.current.parentNode).select('line').remove();
      } else if (d3.event.subject.hasMoved) {
        dispatch(updateNodesPositions(d3.event.subject.nodesPositions));
      }
    });
}

const updateLinksPositions = (nodesPositions, linksIn, linksOut, linksInOut) => {
  const state = store.getState();
  linksIn.forEach((link) => {
    const pos = nodesPositions[state.graph.graph.data.links[link].target];
    updateLinkPositionSimple(link, null, pos);
  });
  linksOut.forEach((link) => {
    const pos = nodesPositions[state.graph.graph.data.links[link].source];
    updateLinkPositionSimple(link, pos, null);
  });
  linksInOut.forEach((link) => {
    const posSource = nodesPositions[state.graph.graph.data.links[link].source];
    const posTarget = nodesPositions[state.graph.graph.data.links[link].target];
    updateLinkPositionSimple(link, posSource, posTarget);
  });
};
