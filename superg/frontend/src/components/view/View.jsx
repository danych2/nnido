import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

import { getGraph } from '../../actions/graphs';

import CreateNode from './CreateNode';
import DeleteNode from './DeleteNode';
import CreateLink from './CreateLink';
import DeleteLink from './DeleteLink';
import GraphViewer from './GraphViewer';
import ActiveElement from './ActiveElement';
import SaveGraph from './SaveGraph';
import Model from './Model';

function View() {
  const dispatch = useDispatch();

  const urlParams = useParams();
  const graph_pk = useSelector((state) => state.graph.graph.pk);

  useEffect(() => {
    dispatch(getGraph(urlParams.graph_id));
  }, [urlParams.graph_id]);

  if (graph_pk) {
    return (
      <div id="grid_container">
        {/* <div className="comp">
          <CreateNode />
          <DeleteNode />
          <CreateLink />
          <DeleteLink />
        </div> */}
        <GraphViewer />
        <div>
          <ActiveElement />
          <br />
          <Model />
          <br />
          <SaveGraph />
        </div>
      </div>
    );
  }
  return '';
}

export default View;
