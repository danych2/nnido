import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getGraphs } from '../../slices/graphSlice';
import GraphCard from './GraphCard';

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
          <GraphCard
            key={graph.id}
            id={graph.id}
            name={graph.name}
            date={graph.date}
          />
        ))}
      </div>
    </>
  );
};

export default GraphsList;
