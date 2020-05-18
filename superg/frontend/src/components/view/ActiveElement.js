import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ActiveNode from './ActiveNode';
import ActiveLink from './ActiveLink';

export class ActiveElement extends Component {

  static propTypes = {
    activeElement: PropTypes.object,
  }

  componentDidUpdate(){
    console.log("activeelement_updated")
  }

  render() {
    let content;
    if (this.props.activeElement) {
      if (this.props.activeElement.type.localeCompare("node") == 0) {
        content = <ActiveNode key={this.props.activeElement.id} node_id={this.props.activeElement.id} />
      } else if (this.props.activeElement.type.localeCompare("link") == 0) {
        content = <ActiveLink key={this.props.activeElement.id} link_id={this.props.activeElement.id} />
      }
    } else {
      content = "Ningún elemento seleccionado"
    }
    return (
      <div className="comp">{ content }</div>
    )
  };
}

const mapStateToProps = state => ({
  activeElement: state.graph.activeElement,
});

export default connect(mapStateToProps, null)(ActiveElement);