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
  const status = useSelector((state) => state.graph.graphStatus);

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    dispatch(getGraph(urlParams.graph_id));
  }, [urlParams.graph_id]);

  if (status === 'loaded' && graph_pk) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div id="graph_name" style={{ flexShrink: '0' }}>
          {graph_name}
        </div>
        <div className="relative h-full m-1">
          <GraphViewer />
          <div className="absolute top-0 left-0 bg-primary border-r border-b rounded-br pr-1 pb-1 border-black max-h-full">
            <Model />
          </div>
          <div className="absolute top-0 right-0 bg-primary border-l border-b rounded-bl pl-1 pb-1 border-black">
            <Selection />
          </div>
          {isAuthenticated && <SaveGraph />}
        </div>
      </div>
    );
  }
  if (status === 'loading') {
    return (
      <div>
        <h1>Cargando grafo...</h1>
      </div>
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
