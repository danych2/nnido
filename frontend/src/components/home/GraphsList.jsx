import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getGraphs, deleteGraph } from '../../slices/graphSlice';

const GraphsList = () => {
  const graphs = useSelector((state) => state.graph.graphs);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getGraphs());
  }, [dispatch, getGraphs, user]);

  return (
    <>
      {!user && (
        <h4>Grafos públicos:</h4>
      )}
      <div className="container">
        {graphs.map((graph) => (
          <div className="comp" key={graph.pk}>
            <Link to={`/view/${graph.pk}`}>{graph.name}</Link>
            <br />
            {`Creado el ${new Date(graph.date).toLocaleDateString()}`}
            <br />
            <button type="button" onClick={() => dispatch(deleteGraph(graph.pk))}>Eliminar grafo</button>
          </div>
        ))}
      </div>
    </>
  );
};

export default GraphsList;
