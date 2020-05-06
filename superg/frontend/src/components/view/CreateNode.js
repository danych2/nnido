import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { createNode } from '../../actions/graphs';

export class CreateNode extends Component {
  state = {
    name: ""
  };

  static propTypes = {
    createNode: PropTypes.func.isRequired
  };

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  onSubmit = e => {
    e.preventDefault();
    const { name } = this.state;
    const node_data = { name };
    const node_position = { x:200, y:200 };
    this.props.createNode({ data: node_data, position: node_position });
    this.setState({...this.state, name: ""});
  };

  render() {
    const { name } = this.state;
    return (
      <div className="comp">
        <form onSubmit={this.onSubmit}>
          <label>Nombre</label>
          <input autoComplete="off" type="text" name="name" onChange={this.onChange} value={name} /><br />
          <button type="submit">Crear nodo</button>
        </form>
      </div>
    )
  };
}

export default connect(null, { createNode })(CreateNode);