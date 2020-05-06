import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { deleteNode } from '../../actions/graphs';

export class DeleteNode extends Component {
  state = {
    node_id: ""
  };

  static propTypes = {
    deleteNode: PropTypes.func.isRequired,
    nodes: PropTypes.array.isRequired,
  }

  onChange = e => {this.setState({ node_id: e.target.value })};

  onClick = e => {
    e.preventDefault();
    const { node_id } = this.state;
    if(typeof node_id !== 'undefined') {
      this.props.deleteNode(node_id);
    }
  };

  render() {
    var content;
    if(this.props.nodes.length > 0) {
      content = (
        <Fragment>
          Nodo: <select name="node_id" defaultValue={'DEFAULT'} onChange={this.onChange}>
            <option hidden disabled value='DEFAULT'> -- </option>
          { this.props.nodes.map(node => (
            <option key={node.id} value={node.id}>{node.name}</option>
          ))}
          </select><br />
          <button onClick={this.onClick}>Eliminar nodo</button>
        </Fragment>)
    } else {
      content = "Crea algún nodo antes de poder eliminar algún nodo"
    }
    return (
      <div className="comp">{ content }</div>
    )
  };
}

const mapStateToProps = state => ({
  nodes: state.graph.graph.data.nodes,
});

export default connect(mapStateToProps, { deleteNode })(DeleteNode);