import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import * as d3 from 'd3';

import {
  selectMultipleNodes,
} from '../../actions/graphs';
import { normalizeCoords } from '../../func';

const RubberBand = () => {
  const dispatch = useDispatch();
  const node_positions = (
    useSelector((state) => state.graph.graph.visualization.node_positions)
  );

  const nodes_x_sorted = Object.entries(node_positions)
    .map(([k, v]) => [v.x, k])
    .sort((a, b) => a[0] - b[0]);

  const nodes_y_sorted = Object.entries(node_positions)
    .map(([k, v]) => [v.y, k])
    .sort((a, b) => a[0] - b[0]);

  const [visibility, setVisibility] = useState(false);
  const [original_pos, setOriginal] = useState([0, 0]);
  const [current_pos, setCurrent] = useState([0, 0]);

  const x = Math.min(original_pos[0], current_pos[0]);
  const y = Math.min(original_pos[1], current_pos[1]);

  useEffect(() => {
    const svg = d3.select('#graph_container');
    const rubberband_behavior = d3.drag().filter(() => !d3.event.ctrlKey && !d3.event.button)
      .on('start', () => {
        const zoomTransform = d3.zoomTransform(svg.node());
        setVisibility(true);
        setOriginal([d3.event.sourceEvent.offsetX, d3.event.sourceEvent.offsetY]);
        setCurrent([d3.event.sourceEvent.offsetX, d3.event.sourceEvent.offsetY]);
        const { x, y } = normalizeCoords(
          zoomTransform.invertX(d3.event.sourceEvent.offsetX),
          zoomTransform.invertY(d3.event.sourceEvent.offsetY),
        );

        let x_index = 0;
        while (nodes_x_sorted.length > x_index && nodes_x_sorted[x_index][0] < x) {
          x_index += 1;
        }
        x_index -= 0.5;
        let y_index = 0;
        while (nodes_y_sorted.length > y_index && nodes_y_sorted[y_index][0] < y) {
          y_index += 1;
        }
        y_index -= 0.5;
        d3.select('#rubberband').node().original_pos = [x, y];
        d3.select('#rubberband').node().last_pos = [x, y];
        d3.select('#rubberband').node().original_index = [x_index, y_index];
        d3.select('#rubberband').node().last_index = [x_index, y_index];
        d3.select('#rubberband').node().hovered_x = new Set();
        d3.select('#rubberband').node().hovered_y = new Set();
        d3.select('#rubberband').node().hovered_xy = new Set();
      })
      .on('drag', () => {
        const zoomTransform = d3.zoomTransform(svg.node());
        setCurrent([d3.event.sourceEvent.offsetX, d3.event.sourceEvent.offsetY]);
        const { x, y } = normalizeCoords(
          zoomTransform.invertX(d3.event.sourceEvent.offsetX),
          zoomTransform.invertY(d3.event.sourceEvent.offsetY),
        );

        const { original_index } = d3.select('#rubberband').node();
        const { last_pos } = d3.select('#rubberband').node();
        const { last_index } = d3.select('#rubberband').node();
        const { hovered_x, hovered_y } = d3.select('#rubberband').node();
        const new_index = [last_index[0], last_index[1]];

        let change = false;
        if (x < last_pos[0] && last_index[0] > 0
            && nodes_x_sorted[Math.floor(last_index[0])][0] > x) {
          new_index[0] -= 1;
          if (original_index[0] > new_index[0]) { // left border moved left - add node
            hovered_x.add(nodes_x_sorted[Math.floor(last_index[0])][1]);
          } else { // right border moved left - remove node
            hovered_x.delete(nodes_x_sorted[Math.floor(last_index[0])][1]);
          }
          change = true;
        } else if (x > last_pos[0] && last_index[0] < nodes_x_sorted.length - 1
            && nodes_x_sorted[Math.ceil(last_index[0])][0] < x) {
          new_index[0] += 1;
          if (original_index[0] >= new_index[0]) { // left border moved right - remove node
            hovered_x.delete(nodes_x_sorted[Math.ceil(last_index[0])][1]);
          } else { // right border moved right - add node
            hovered_x.add(nodes_x_sorted[Math.ceil(last_index[0])][1]);
          }
          change = true;
        }

        if (y < last_pos[1] && last_index[1] > 0
            && nodes_y_sorted[Math.floor(last_index[1])][0] > y) {
          new_index[1] -= 1;
          if (original_index[1] > new_index[1]) { // top border moved up - add node
            hovered_y.add(nodes_y_sorted[Math.floor(last_index[1])][1]);
          } else { // bottom border moved up - remove node
            hovered_y.delete(nodes_y_sorted[Math.floor(last_index[1])][1]);
          }
          change = true;
        } else if (y > last_pos[1] && last_index[1] < nodes_y_sorted.length - 1
            && nodes_y_sorted[Math.ceil(last_index[1])][0] < y) {
          new_index[1] += 1;
          if (original_index[1] >= new_index[1]) { // top border moved down - remove node
            hovered_y.delete(nodes_y_sorted[Math.ceil(last_index[1])][1]);
          } else { // bottom border moved down - add node
            hovered_y.add(nodes_y_sorted[Math.ceil(last_index[1])][1]);
          }
          change = true;
        }
        if (change) {
          d3.selectAll('.rubberband_hovering').classed('rubberband_hovering', false);
          const xy_intersection = new Set([...hovered_x].filter((x) => hovered_y.has(x)));
          xy_intersection.forEach((node_id) => {
            d3.select(`#node_${node_id}`).classed('rubberband_hovering', true);
          });
        }
        d3.select('#rubberband').node().last_pos = [x, y];
        d3.select('#rubberband').node().last_index = new_index;
      })
      .on('end', () => {
        const zoomTransform = d3.zoomTransform(svg.node());
        setVisibility(false);
        d3.selectAll('.rubberband_hovering').classed('rubberband_hovering', false);
        const { original_pos } = d3.select('#rubberband').node();
        const { x, y } = normalizeCoords(
          zoomTransform.invertX(d3.event.sourceEvent.offsetX),
          zoomTransform.invertY(d3.event.sourceEvent.offsetY),
        );
        const max_x = Math.max(original_pos[0], x);
        const min_x = Math.min(original_pos[0], x);
        const max_y = Math.max(original_pos[1], y);
        const min_y = Math.min(original_pos[1], y);
        const hovered_nodes = Object.entries(node_positions).filter(
          ([_, v]) => v.x > min_x && v.x < max_x && v.y > min_y && v.y < max_y,
        ).map(([k, _]) => k);
        dispatch(selectMultipleNodes({ ids: hovered_nodes, type: 'node' }));
      });
    svg.call(rubberband_behavior);
  }, [node_positions]);

  return (
    <rect
      id="rubberband"
      x={x}
      y={y}
      width={Math.max(original_pos[0], current_pos[0]) - x}
      height={Math.max(original_pos[1], current_pos[1]) - y}
      visibility={visibility ? 'visible' : 'hidden'}
      rx="10"
      ry="10"
    />
  );
};

export default RubberBand;
