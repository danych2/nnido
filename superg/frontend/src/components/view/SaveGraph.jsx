import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { updateGraph } from '../../actions/graphs';

const SaveGraph = () => {
  const dispatch = useDispatch();
  const myRef = useRef();
  const graph = useSelector((state) => state.graph.graph);

  return (
    <div className="comp">
      <button type="button" onClick={() => dispatch(updateGraph(graph))}>Guardar grafo</button>
    </div>
  );
};

export default SaveGraph;
