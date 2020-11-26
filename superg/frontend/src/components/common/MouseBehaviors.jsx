import * as d3 from 'd3';
import {
  normalizeCoords, denormalizeCoords,
} from '../../func';
import {
  updateNodePosition, createLink,
} from '../../actions/graphs';

export default function createNodeDragBehavior(
  node_id,
  dispatch,
  positionRef,
  myRef,
  creatingLinkRef,
  setCreatingLink,
  draggingNodeRef,
  setDraggingNode,
  defaultLinkType,
  setActiveElement,
) {
  return d3.drag()
    .on('start', (d) => {
      const currentPos = positionRef.current;
      const { x: currentX, y: currentY } = denormalizeCoords(currentPos.x, currentPos.y);
      if (d3.event.sourceEvent.shiftKey) {
        d3.select(myRef.current.parentNode).insert('line', ':first-child')
          .attr('class', 'creating_link')
          .attr('x1', currentX)
          .attr('y1', currentY)
          .attr('x2', currentX)
          .attr('y2', currentY);
        setCreatingLink(true);
      }
    })
    .on('drag', (d) => {
      if (creatingLinkRef.current) {
        d3.select(myRef.current.parentNode).select('line')
          .attr('x2', d3.event.x).attr('y2', d3.event.y);
      } else if (draggingNodeRef.current
                  || Math.max(Math.abs(d3.event.dx), Math.abs(d3.event.dy)) > 1) {
        d3.select(myRef.current)
          .attr('transform', `translate(${d3.event.x}, ${d3.event.y})`);
        if (!draggingNodeRef.current) { setDraggingNode(true); }
      }
    })
    .on('end', (d) => {
      if (draggingNodeRef.current) {
        setDraggingNode(false);
        const { x: eventX, y: eventY } = normalizeCoords(d3.event.x, d3.event.y);
        dispatch(updateNodePosition({
          id: node_id,
          x: eventX,
          y: eventY,
        }));
      }
      if (creatingLinkRef.current) {
        const targetRect = document
          .elementsFromPoint(d3.event.sourceEvent.x, d3.event.sourceEvent.y)
          .find((x) => x.nodeName === 'rect');
        if (targetRect !== undefined) {
          const target_node_name = targetRect.parentNode.id.slice(5);
          dispatch(createLink({
            source: node_id,
            target: target_node_name,
            type: defaultLinkType,
          }));
        }
        d3.select(myRef.current.parentNode).select('line').remove();
        setCreatingLink(false);
      } else {
        // Only set element as active if a new link was not created
        dispatch(setActiveElement({ id: node_id, type: 'node' }));
      }
    });
}
