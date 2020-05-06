import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { updateLink } from '../../actions/graphs';

export class ActiveLink extends Component {

  static propTypes = {
    updateLink: PropTypes.func.isRequired,
    activeElement: PropTypes.object,
    graph_data: PropTypes.object.isRequired,
  }

  render() {
    const active_link = this.props.graph_data.links.find(x=>x.id===this.props.activeElement.id);
    return (
      <Fragment>
        <b>Enlace seleccionado</b><br />
        {this.props.graph_data.nodes.find(x=>x.id===active_link.source).name +
          " - " + this.props.graph_data.nodes.find(x=>x.id===active_link.target).name}<br />
        <button>Update</button>
      </Fragment>
    )
  };
}

const mapStateToProps = state => ({
  graph_data: state.graph.graph.data,
  activeElement: state.graph.activeElement,
});

export default connect(mapStateToProps, { updateLink })(ActiveLink);