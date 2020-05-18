import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import create_graph, { update_graph } from '../../d3/graph';
import Node from './Node';
import Link from './Link';

import { createNode, updateZoom } from '../../actions/graphs';

import * as d3 from 'd3';
import { v4 as uuid } from 'uuid';

export class GraphViewer extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }

  static propTypes = {
    graph: PropTypes.object.isRequired,
    createNode: PropTypes.func.isRequired,
    updateZoom: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const svg = d3.select(this.myRef.current).select('svg');
    const svg_g = svg.select("g");

    const zoom_behaviour = d3.zoom().on("zoom", function () {
         svg_g.attr("transform", d3.event.transform);
      }).on("end", () => {
         this.props.updateZoom(d3.event.transform);
      })

    svg.call(zoom_behaviour)
      .on("dblclick.zoom", null)
      .on("dblclick", () => {
        const id = uuid();
        const zoomTransform = d3.zoomTransform(svg.node())
        const {x, y} = normalize_coords(zoomTransform.invertX(d3.event.offsetX),
                                        zoomTransform.invertY(d3.event.offsetY));
        this.props.createNode({id: id, data: {name: "nombre"}, position: {x: x, y: y}});
        d3.select("#node_"+id).dispatch('dblclick');
      })

    if(this.props.graph.visualization.zoom !== undefined) {
      const zoom = this.props.graph.visualization.zoom;
      svg.call(zoom_behaviour.transform, d3.zoomIdentity.translate(zoom.x, zoom.y).scale(zoom.k));
    }
  }

  componentDidUpdate() {
    //console.log("GraphViewer updated")
  }

  render() {
    return (
      <div ref={this.myRef} className="comp">
        <svg id="graph_container" width="100%" height="90vh">
          <g>
            <g className="links">
              { this.props.graph.data.links.map(link => (
                  <Link key={link.id} link_id={link.id} />
              ))}
            </g>
              <g className="nodes">
                { this.props.graph.data.nodes.map(node => (
                    <Node key={node.id} node_id={node.id} />
                ))}
              </g>
          </g>
        </svg>
      </div>
    )
  };
}

function dataToD3(graph) {
  if(graph.data.nodes.length > 0) {
    return {nodes: graph.data.nodes.map(node=>({ ...node, ...graph.visualization.node_positions[node.id] })),
      links: JSON.parse(JSON.stringify(graph.data.links))};
  } else {
    return {nodes: [], links: []};
  }
}

function normalize_coords(x, y) {
  const bound_rect = document.getElementById("graph_container").getBoundingClientRect();
  const width = bound_rect.width;
  const height = bound_rect.height;
  let norm_x, norm_y;
  if(width > height) {
    norm_x = (x-(width-height)/2)/height;
    norm_y = y/height;
  } else {
    norm_x = x/width;
    norm_y = (y-(height-width)/2)/width;
  }
  return {x: norm_x, y: norm_y}
}

const mapStateToProps = state => ({
  graph: state.graph.graph
});

export default connect(mapStateToProps, { createNode, updateZoom })(GraphViewer);