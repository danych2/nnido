import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { createGraph } from '../../actions/graphs';

export class NewGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
    };
  }

  static propTypes = {
    createGraph: PropTypes.func.isRequired,
  };

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  onSubmit = (e) => {
    e.preventDefault();
    const { name } = this.state;
    const graph = { name };
    this.props.createGraph(graph);
  };

  render() {
    const { name } = this.state;
    return (
      <div className="comp">
        <form onSubmit={this.onSubmit}>
          <label>Nombre</label>
          <input type="text" name="name" onChange={this.onChange} value={name} />
          <br />
          <button type="submit">Crear grafo nuevo</button>
        </form>
      </div>
    );
  }
}

export default connect(null, { createGraph })(NewGraph);
