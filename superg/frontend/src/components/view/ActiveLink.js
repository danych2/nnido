import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { updateLink } from '../../actions/graphs';

export class ActiveLink extends Component {
  constructor(props) {
    super(props);
    const link = this.props.link;

    this.state = {
      prevProps: "",
    };
  }

  static propTypes = {
    updateLink: PropTypes.func.isRequired,
    link_id: PropTypes.string.isRequired,
    link: PropTypes.object.isRequired,
    link_types: PropTypes.object.isRequired,
    nodes: PropTypes.array.isRequired,
  }

  componentDidUpdate(){
    console.log("activelink_updated")
  }

  onChange = e => {
    const value = e.target.name === 'directed'?e.target.checked:e.target.value;
    this.setState({ [e.target.name]: value })
  };

  onTypeChange = e => {
    this.setState({ type: e.target.value});
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
    const { type, properties } = this.state;
    const filtered_props = Object.keys(properties).reduce((dict, key)=>{
      if(properties[key] !== '') //we add the property if not empty
        dict[key]=properties[key];
      return dict;
    }, {})
    this.props.updateLink({
      id: this.props.link_id,
      type: type,
      properties: filtered_props,
      directed: this.state.directed,
    });
  };

  static getDerivedStateFromProps(props, state) {
    if(JSON.stringify(props.link) !== JSON.stringify(state.prevProps.link)) {
      return {
        type: props.link.type?props.link.type:'',
        properties: props.link.properties,
        directed: (props.link.directed === undefined)?false:props.link.directed,
        new_property: "",
        prevProps: props,
      };
    } else {
      return null;
    }
  }

  render() {
    let type_properties_dict = {};
    if(this.state.type !== '') {
      const type_property_names = Object.keys(this.props.link_types[this.state.type].properties);
      type_properties_dict = type_property_names.reduce((dict,key) => (dict[key] = '', dict), {})
    }
    const all_properties = {...type_properties_dict, ...this.state.properties}
    return (
      <Fragment>
        <b>Enlace seleccionado</b><br />
        {this.props.nodes.find(x=>x.id===this.props.link.source).name +
          " - " + this.props.nodes.find(x=>x.id===this.props.link.target).name}<br />
        Dirigido? <input name="directed" type="checkbox" checked={this.state.directed} onChange={this.onChange} /><br />
        Tipo:
        <select name="type" value={this.state.type} onChange={this.onTypeChange}>
          <option value=''> -- </option>
          { Object.keys(this.props.link_types).map(link_type => (
            <option key={link_type} value={link_type}>{link_type}</option>
          ))}
        </select> <br />
        Propiedades:<br />
        { Object.keys(all_properties).map(property => (
          <Fragment key={property}>
            {property}: <input type="text" name={property} onChange={this.onPropertyChange} value={ this.state.properties[property] } /><br />
          </Fragment>
        ))}
        <div className="comp">
          <input type="text" name="new_property" onChange={this.onChange} value={ this.state.new_property } /><button onClick={this.addProperty}>Añadir propiedad</button><br />
        </div>
        <button onClick={this.onClick}>Actualizar</button>
      </Fragment>
    )
  };
}

const mapStateToProps = (state, ownProps) => ({
  link: state.graph.graph.data.links.find(x => x.id === ownProps.link_id),
  link_types: state.graph.graph.model.link_types,
  nodes: state.graph.graph.data.nodes,
});

export default connect(mapStateToProps, { updateLink })(ActiveLink);