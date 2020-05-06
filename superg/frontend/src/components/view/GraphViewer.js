import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import create_graph, { update_graph } from '../../d3/graph';


export class GraphViewer extends Component {
  static propTypes = {
    graph: PropTypes.object.isRequired,
  }

  componentDidMount() {
    create_graph(dataToD3(this.props.graph), this.props.graph.visualization.zoom)
    console.log("GraphViewer mounted")
  }

  componentDidUpdate() {
    update_graph(dataToD3(this.props.graph), this.props.graph.visualization.zoom)
    console.log("GraphViewer updated")
  }

  render() {
    return (
      <div className="comp">
        <svg id="graph_container" />
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

const mapStateToProps = state => ({
  graph: state.graph.graph
});

export default connect(mapStateToProps)(GraphViewer);