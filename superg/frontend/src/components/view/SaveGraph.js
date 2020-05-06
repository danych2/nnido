import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { updateGraph } from '../../actions/graphs';

export class SaveGraph extends Component {
  static propTypes = {
    graph: PropTypes.object.isRequired,
    updateGraph: PropTypes.func.isRequired,
  }

  render() {
    return (
      <div className="comp">
          <button onClick={this.props.updateGraph.bind(this, this.props.graph)}>Guardar grafo</button>
      </div>
    )
  };
}

const mapStateToProps = state => ({
  graph: state.graph.graph
});

export default connect(mapStateToProps, { updateGraph })(SaveGraph);