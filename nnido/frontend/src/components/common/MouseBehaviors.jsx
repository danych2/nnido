import * as d3 from 'd3';
import {
  normalizeCoords, denormalizeCoords,
} from '../../func';
import {
  updateNodePosition, updateNodesPositions, createLink,
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
  selectElements,
  selection,
) {
  const isSelected = selection.ids.includes(node_id);

  return d3.drag()
    .filter(() => !d3.event.button)
    .on('start', (d) => {
      const currentPos = positionRef.current;
      const { x: currentX, y: currentY } = denormalizeCoords(currentPos.x, currentPos.y);
      if (d3.event.sourceEvent.ctrlKey) { // if shift -> create new link
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
        if (isSelected) {
          d3.selectAll('.nodes g').select(function isSelected(d, i) { return selection.ids.includes(this.id.slice(5)) ? this : null; })
            .each(function translateNode(d, i) {
              const transform = d3.select(this).attr('transform').match(/\((\S+)\s*,\s*(\S+)\)/);
              const old_x = parseFloat(transform[1]);
              const old_y = parseFloat(transform[2]);
              d3.select(this)
                .attr('transform', `translate(${old_x + d3.event.dx}, ${old_y + d3.event.dy})`);
            });
        } else {
          d3.select(myRef.current)
            .attr('transform', `translate(${d3.event.x}, ${d3.event.y})`);
        }
        if (!draggingNodeRef.current) { setDraggingNode(true); }
      }
    })
    .on('end', (d) => {
      if (draggingNodeRef.current) {
        setDraggingNode(false);
        const { x: eventX, y: eventY } = normalizeCoords(d3.event.x, d3.event.y);
        if (isSelected) {
          const new_positions = {};
          d3.selectAll('.nodes g').select(function isSelected(d, i) { return selection.ids.includes(this.id.slice(5)) ? this : null; }).each(function saveNewPosition(d, i) {
            const id = d3.select(this).node().id.slice(5);
            const transform = d3.select(this).attr('transform').match(/\((\S+)\s*,\s*(\S+)\)/);
            new_positions[id] = normalizeCoords(
              parseFloat(transform[1]) + d3.event.dx,
              parseFloat(transform[2]) + d3.event.dy,
            );
          });
          dispatch(updateNodesPositions(new_positions));
        } else {
          dispatch(updateNodePosition({
            id: node_id,
            x: eventX,
            y: eventY,
          }));
          dispatch(selectElements({ ids: [node_id], type: 'node' }));
        }
      }
      if (creatingLinkRef.current) {
        const targetRect = document
          .elementsFromPoint(d3.event.sourceEvent.x, d3.event.sourceEvent.y)
          .find((x) => x.nodeName === 'rect');
        if (targetRect !== undefined) {
          const target_node_name = targetRect.parentNode.id.slice(5);
          if (target_node_name !== node_id) {
            dispatch(createLink({
              source: node_id,
              target: target_node_name,
              type: defaultLinkType,
            }));
          }
        }
        d3.select(myRef.current.parentNode).select('line').remove();
        setCreatingLink(false);
      }
    });
}
