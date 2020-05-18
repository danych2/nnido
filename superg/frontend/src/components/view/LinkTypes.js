import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { createLinkType, updateLinkType } from '../../actions/graphs';

export class LinkTypes extends Component {
  state = {
    new_linktype: "",
    new_property: "",
    linktype_selected_name: undefined,
    linktype_selected: undefined,
  };

  static propTypes = {
    link_types: PropTypes.object.isRequired,
  }

  onChange = e => {
    if(e.target.name === 'directed') {
      this.setState({ linktype_selected: {
        ...this.state.linktype_selected,
        directed: e.target.checked
      } })
    } else {
      this.setState({ [e.target.name]: e.target.value })
    }
  };

  onSubmitNewType = e => {
    e.preventDefault();
    this.props.createLinkType({ name: this.state.new_linktype});
    this.setState({new_linktype: ""});
  };

  addProperty = e => {
    e.preventDefault();
    this.setState({
      linktype_selected: {...this.state.linktype_selected,
        properties: {
          ...this.state.linktype_selected.properties,
          [this.state.new_property]: {}
        }
      },
      new_property: "",
    });
  }

  selectLinkType = e => {
    this.setState({linktype_selected: this.props.link_types[e.target.value], linktype_selected_name: e.target.value});
  }

  onUpdateLinkType = e => {
    e.preventDefault();
    const { linktype_selected, linktype_selected_name } = this.state;
    this.props.updateLinkType({
      name: linktype_selected_name,
      ...linktype_selected
    });
  }

  render() {
    let edit_linktype_area = "";
    if(this.state.linktype_selected !== undefined) {
      edit_linktype_area = <Fragment>
        {this.state.linktype_selected_name}<br />
        Dirigido? <input name="directed" type="checkbox" checked={this.state.linktype_selected.directed} onChange={this.onChange} /><br />
        Propiedades:<br />
        { Object.keys(this.state.linktype_selected.properties).map(property => (
          <Fragment key={property}>
            <span>{property}</span><br />
          </Fragment>
        ))}
        <input type="text" name="new_property" onChange={this.onChange} value={ this.state.new_property } />
        <button onClick={this.addProperty}>Añadir propiedad</button><br />
        <button onClick={this.onUpdateLinkType}>Actualizar</button>
      </Fragment>
    }
    return (
      <div className="comp">
        <b>Tipos de enlaces</b> <br/>
        Editar tipo:
        <select name="link_type" defaultValue={'DEFAULT'} onChange={this.selectLinkType}>
          <option hidden disabled value='DEFAULT'> -- </option>
          { Object.keys(this.props.link_types).map(link_type => (
            <option key={link_type} value={link_type}>{link_type}</option>
          ))}
        </select><br />
        {edit_linktype_area}
        <div className="comp">
          <form onSubmit={this.onSubmitNewType}>
            <input autoComplete="off" type="text" name="new_linktype" onChange={this.onChange} value={this.state.new_linktype} /><br />
            <button type="submit">Crear tipo de enlace</button>
          </form>
        </div>
      </div>
    )
  };
}

const mapStateToProps = state => ({
  link_types: state.graph.graph.model.link_types,
});

export default connect(mapStateToProps, { createLinkType, updateLinkType })(LinkTypes);