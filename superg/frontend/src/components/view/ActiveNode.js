import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { updateNode } from '../../actions/graphs';

export class ActiveNode extends Component {
  constructor(props) {
    super(props);
    const node = this.props.graph_data.nodes.find(x=>x.id===this.props.activeElement.id);
    this.state = {
      name: node.name,
      type: node.type,
      content: node.content,
      properties: node.properties,
      new_property: "",
    };
  }

  static propTypes = {
    updateNode: PropTypes.func.isRequired,
    activeElement: PropTypes.object,
    graph_data: PropTypes.object.isRequired,
  }

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  onPropertyChange = e => this.setState({ properties: {
    ...this.state.properties,
    [e.target.name]: e.target.value
  } });

  appPropiety = e => {
    e.preventDefault();
    this.setState({ properties: {
      ...this.state.properties,
      [this.state.new_property]: ""} });
    this.state.new_property = "";
  }

  onClick = e => {
    e.preventDefault();
    const { name, type, content, properties } = this.state;
    this.props.updateNode({
      id: this.props.activeElement.id,
      name: name,
      type: type,
      content: content,
      properties: properties,
    });
  };

  render() {
    return (
      <Fragment>
        <b>Nodo seleccionado</b><br />
        <input type="text" name="name" onChange={this.onChange} value={ this.state.name } /><br />
        Tipo: <input type="text" name="type" onChange={this.onChange} value={ this.state.type } /><br />
        Contenido: <input type="text" name="content" onChange={this.onChange} value={ this.state.content } /><br />
        Propiedades:<br />
        { Object.keys(this.state.properties).map(property => (
          <Fragment>
            {property}: <input type="text" name={property} onChange={this.onPropertyChange} value={ this.state.properties[property] } /><br />
          </Fragment>
        ))}
        <input type="text" name="new_property" onChange={this.onChange} value={ this.state.new_property } /><button onClick={this.appPropiety}>Añadir propiedad</button><br />
        <button onClick={this.onClick}>Actualizar</button>
      </Fragment>
    )
  };
}

const mapStateToProps = state => ({
  graph_data: state.graph.graph.data,
  activeElement: state.graph.activeElement,
});

export default connect(mapStateToProps, { updateNode })(ActiveNode);