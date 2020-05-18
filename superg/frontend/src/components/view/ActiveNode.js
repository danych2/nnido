import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { updateNode } from '../../actions/graphs';

export class ActiveNode extends Component {
  constructor(props) {
    super(props);
    const node = this.props.node;
    this.state = {
      name: node.name,
      type: node.type?node.type:'DEFAULT',
      content: node.content,
      properties: node.properties,
      new_property: "",
      prevProps: "",
    };
  }

  static propTypes = {
    updateNode: PropTypes.func.isRequired,
    node_id: PropTypes.string.isRequired,
    node: PropTypes.object.isRequired,
    node_types: PropTypes.object.isRequired,
  }

  componentDidUpdate(){
    console.log("activenode_updated")
  }

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  onTypeChange = e => {
    //Remove properties of old type if they are empty
    let filtered_props = this.state.properties;
    if(this.state.type !== 'DEFAULT') {
      const old_type_properties = Object.keys(this.props.node_types[this.state.type].properties);
      filtered_props = Object.keys(this.state.properties).reduce((dict, key)=>{
        if(this.state.properties[key] !== '' || !old_type_properties.includes(key))
          dict[key]=this.state.properties[key];
        return dict;
      }, {})
    }
    //Convert type properties into dict with empty values to merge with current properties
    const type_property_names = Object.keys(this.props.node_types[e.target.value].properties);
    const type_properties_dict = type_property_names.reduce((dict,key) => (dict[key] = '', dict), {})
    this.setState({ type: e.target.value,
      properties: {
        ...type_properties_dict,
        ...filtered_props
      }});
  }

  onPropertyChange = e => this.setState({ properties: {
    ...this.state.properties,
    [e.target.name]: e.target.value
  } });

  addProperty = e => {
    e.preventDefault();
    this.setState({ properties: {
      ...this.state.properties,
      [this.state.new_property]: ""},
      new_property: "",
    });
  }

  onClick = e => {
    e.preventDefault();
    const { name, type, content, properties } = this.state;
    const filtered_props = Object.keys(properties).reduce((dict, key)=>{
      if(properties[key] !== '')
        dict[key]=properties[key];
      return dict;
    }, {})
    this.props.updateNode({
      id: this.props.node_id,
      name: name,
      type: type,
      content: content,
      properties: filtered_props,
    });
  };

  static getDerivedStateFromProps(props, state) {
    if(JSON.stringify(props.node) !== JSON.stringify(state.prevProps.node)) {
      return {
        name: props.node.name,
        type: props.node.type?props.node.type:'DEFAULT',
        content: props.node.content,
        properties: props.node.properties,
        prevProps: props,
      };
    } else {
      return null;
    }
  }

  render() {
    return (
      <Fragment>
        <b>Nodo seleccionado</b><br />
        <input type="text" name="name" onChange={this.onChange} value={ this.state.name } /><br />
        Tipo:
        <select name="type" value={this.state.type} onChange={this.onTypeChange}>
          <option hidden disabled value='DEFAULT'> -- </option>
          { Object.keys(this.props.node_types).map(node_type => (
            <option key={node_type} value={node_type}>{node_type}</option>
          ))}
        </select> <br />
        Contenido: <input type="text" name="content" onChange={this.onChange} value={ this.state.content } /><br />
        Propiedades:<br />
        { Object.keys(this.state.properties).map(property => (
          <Fragment key={property}>
            {property}: <input type="text" name={property} onChange={this.onPropertyChange} value={ this.state.properties[property] } /><br />
          </Fragment>
        ))}
        <input type="text" name="new_property" onChange={this.onChange} value={ this.state.new_property } /><button onClick={this.addProperty}>Añadir propiedad</button><br />
        <button onClick={this.onClick}>Actualizar</button>
      </Fragment>
    )
  };
}

const mapStateToProps = (state, ownProps) => ({
  node: state.graph.graph.data.nodes.find(x => x.id === ownProps.node_id),
  node_types: state.graph.graph.model.node_types,
});

export default connect(mapStateToProps, { updateNode })(ActiveNode);