import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getGraph } from '../../actions/graphs';

import CreateNode from './CreateNode';
import DeleteNode from './DeleteNode';
import CreateLink from './CreateLink';
import DeleteLink from './DeleteLink';
import GraphViewer from './GraphViewer';
import ActiveElement from './ActiveElement'
import SaveGraph from './SaveGraph'
import Model from './Model'

export class View extends Component {
  static propTypes = {
    graph: PropTypes.object.isRequired,
  }

  componentDidMount() {
    this.props.getGraph(this.props.match.params.graph_id);
  }

  render() {
    if(Object.keys(this.props.graph).length === 0) {
      return "";
    } else return (
      <div id="grid_container">
        <div className="comp">
          <CreateNode />
          <DeleteNode />
          <CreateLink />
          <DeleteLink />
        </div>
        <GraphViewer />
        <div className="comp">
          <ActiveElement />
          <Model />
          <SaveGraph />
        </div>
      </div>
    )
  };
}

const mapStateToProps = state => {
  return {graph: state.graph.graph}
};

export default connect(mapStateToProps, { getGraph })(View);
