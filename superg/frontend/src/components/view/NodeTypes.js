import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { createNodeType, updateNodeType } from '../../actions/graphs';

export class NodeTypes extends Component {
  state = {
    new_nodetype: "",
    new_property: "",
    nodetype_selected_name: undefined,
    nodetype_selected: undefined,
  };

  static propTypes = {
    node_types: PropTypes.object.isRequired,
  }

  onChange = e => this.setState({ [e.target.name]: e.target.value });
  onSubmitNewType = e => {
    e.preventDefault();
    this.props.createNodeType({ name: this.state.new_nodetype});
    this.setState({new_nodetype: ""});
  };

  addProperty = e => {
    e.preventDefault();
    this.setState({
      nodetype_selected: {...this.state.nodetype_selected,
        properties: {
          ...this.state.nodetype_selected.properties,
          [this.state.new_property]: {}
        }
      },
      new_property: "",
    });
  }

  selectNodeType = e => {
    this.setState({nodetype_selected: this.props.node_types[e.target.value], nodetype_selected_name: e.target.value});
  }

  onUpdateNewNodeType = e => {
    e.preventDefault();
    const { nodetype_selected, nodetype_selected_name } = this.state;
    this.props.updateNodeType({
      name: nodetype_selected_name,
      ...nodetype_selected
    });
  }

  render() {
    let edit_nodetype_area = "";
    if(this.state.nodetype_selected !== undefined) {
      edit_nodetype_area = <Fragment>
        {this.state.nodetype_selected_name}<br />
        Propiedades:<br />
        { Object.keys(this.state.nodetype_selected.properties).map(property => (
          <Fragment key={property}>
            <span>{property}</span><br />
          </Fragment>
        ))}
        <input type="text" name="new_property" onChange={this.onChange} value={ this.state.new_property } /><button onClick={this.addProperty}>Añadir propiedad</button><br />
        <button onClick={this.onUpdateNewNodeType}>Actualizar</button>
      </Fragment>
    }
    return (
      <div className="comp">
        <b>Tipos de nodos</b> <br/>
        Editar tipo:
        <select name="node_type" defaultValue={'DEFAULT'} onChange={this.selectNodeType}>
          <option hidden disabled value='DEFAULT'> -- </option>
          { Object.keys(this.props.node_types).map(node_type => (
            <option key={node_type} value={node_type}>{node_type}</option>
          ))}
        </select><br />
        {edit_nodetype_area}
        <div className="comp">
          <form onSubmit={this.onSubmitNewType}>
            <input autoComplete="off" type="text" name="new_nodetype" onChange={this.onChange} value={this.state.new_nodetype} /><br />
            <button type="submit">Crear tipo de nodo</button>
          </form>
        </div>
      </div>
    )
  };
}

const mapStateToProps = state => ({
  node_types: state.graph.graph.model.node_types,
});

export default connect(mapStateToProps, { createNodeType, updateNodeType })(NodeTypes);