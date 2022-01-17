import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { getGraphs, deleteGraph } from '../../actions/graphs';

export class GraphsList extends Component {
  static propTypes = {
    graphs: PropTypes.array.isRequired,
    getGraphs: PropTypes.func.isRequired,
    deleteGraph: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.getGraphs();
  }

  render() {
    return (
      <div className="container">
        { this.props.graphs.map((graph) => (
          <div className="comp" key={graph.pk}>
            <Link to={`/view/${graph.pk}`}>{ graph.name }</Link>
            <br />
            Creado el
            { new Date(graph.date).toLocaleDateString() }
            <br />
            <button type="button" onClick={this.props.deleteGraph.bind(this, graph.pk)}>Eliminar grafo</button>
          </div>
        ))}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  graphs: state.graph.graphs,
});

export default connect(mapStateToProps, { getGraphs, deleteGraph })(GraphsList);
