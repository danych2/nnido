import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { createLink } from '../../actions/graphs';

export class CreateLink extends Component {
  state = {
    source: "",
    target: "",
  };

  static propTypes = {
    createLink: PropTypes.func.isRequired,
    nodes: PropTypes.array.isRequired,
  };

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  onClick = e => {
    e.preventDefault();
    const { source, target } = this.state;
    if(typeof source !== 'undefined' && typeof target !== 'undefined') {
      const link = { source, target };
      this.props.createLink(link);
    }
  };

  render() {
    let content;
    if(this.props.nodes.length > 1) {
      content = (
        <Fragment>
          Origen: <select name="source" defaultValue={'DEFAULT'} onChange={this.onChange}>
            <option hidden disabled value='DEFAULT'> -- </option>
          { this.props.nodes.filter(node => node.id !== this.state.target)
            .map(node => (
              <option key={node.id} value={node.id}>{node.name}</option>
          ))}
          </select><br />
          Destino: <select name="target" defaultValue={'DEFAULT'} onChange={this.onChange}>
            <option hidden disabled value='DEFAULT'> -- </option>
          { this.props.nodes.filter(node => node.id !== this.state.source)
            .map(node => (
              <option key={node.id} value={node.id}>{node.name}</option>
          ))}
          </select><br />
          <button onClick={this.onClick}>Crear enlace</button>
        </Fragment>)
    } else {
      content = "Crea al menos dos nodos antes de poder crear algún enlace"
    }
    return (
      <div className="comp">{ content }</div>
    )
  };
}

const mapStateToProps = state => ({
  nodes: state.graph.graph.data.nodes,
});

export default connect(mapStateToProps, { createLink })(CreateLink);