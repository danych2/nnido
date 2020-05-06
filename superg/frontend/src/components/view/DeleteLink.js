import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { deleteLink } from '../../actions/graphs';

export class DeleteLink extends Component {
  state = {
    link_id: ""
  };

  static propTypes = {
    deleteLink: PropTypes.func.isRequired,
    links: PropTypes.array.isRequired,
    nodes: PropTypes.array.isRequired,
  }

  onChange = e => {this.setState({ link_id: e.target.value })};

  onClick = e => {
    e.preventDefault();
    const { link_id } = this.state;
    if(typeof link_id !== 'undefined') {
      this.props.deleteLink(link_id);
    }
  };

  render() {
    let content;
    if(this.props.links.length > 0) {
      content = (
        <Fragment>
          Enlace: <select name="link_id" defaultValue={'DEFAULT'} onChange={this.onChange}>
            <option hidden disabled value='DEFAULT'> -- </option>
          { this.props.links.map(link => (
            <option key={link.id} value={link.id}>{
              this.props.nodes.find(x=>x.id===link.source).name +
              " - " + this.props.nodes.find(x=>x.id===link.target).name}</option>
          ))}
          </select><br />
          <button onClick={this.onClick}>Eliminar enlace</button>
        </Fragment>)
    } else {
      content = "Crea algún enlace antes de poder eliminar algún enlace"
    }
    return (
      <div className="comp">{ content }</div>
    )
  };
}

const mapStateToProps = state => ({
  links: state.graph.graph.data.links,
  nodes: state.graph.graph.data.nodes
});

export default connect(mapStateToProps, { deleteLink })(DeleteLink);