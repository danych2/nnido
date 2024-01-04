import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import { getGraph } from '../../slices/graphSlice';

import GraphViewer from './GraphViewer';
import Selection from './Selection';
import SaveGraph from './SaveGraph';
import Model from './Model';

const View = () => {
  const dispatch = useDispatch();

  const urlParams = useParams();
  const graph_pk = useSelector((state) => state.graph.graph.pk);
  const graph_name = useSelector((state) => state.graph.graph.name);
  const error = useSelector((state) => state.graph.error);

  useEffect(() => {
    dispatch(getGraph(urlParams.graph_id));
  }, [urlParams.graph_id]);

  if (!error && graph_pk) {
    return (
      <>
        <div id="graph_name" style={{ flexShrink: '0' }}>
          {graph_name}
        </div>
        <div id="grid_container" style={{ flexGrow: '1', overflow: 'hidden' }}>
          {/* <div className="comp">
            <CreateNode />
            <DeleteNode />
            <CreateLink />
            <DeleteLink />
          </div> */}
          <GraphViewer />
          <div style={{ overflowY: 'scroll' }}>
            <Selection />
            <br />
            <Model />
            <br />
            <SaveGraph />
          </div>
        </div>
      </>
    );
  }
  return (
    <div>
      <h1>
        Grafo no encontrado:
        o bien no existe o no tiene permisos para verlo
      </h1>
    </div>
  );
};

export default View;
