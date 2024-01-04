import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { createLink } from '../../slices/graphSlice';

const CreateLink = () => {
  const dispatch = useDispatch();
  const nodes = useSelector((state) => state.graph.graph.data.nodes);

  const [source, setSource] = useState('');
  const [target, setTarget] = useState('');

  const createNewLink = (e) => {
    e.preventDefault();
    if (typeof source !== 'undefined' && typeof target !== 'undefined') {
      dispatch(createLink({ source, target }));
    }
  };

  let content = 'Crea al menos dos nodos antes de poder crear algún enlace';
  if (Object.keys(nodes).length > 1) {
    content = (
      <>
        Origen:
        <select name="source" value={source} onChange={(e) => setSource(e.target.value)}>
          <option hidden disabled value=""> -- </option>
          { Object.keys(nodes).filter((node_id) => node_id !== target)
            .map((node_id) => (
              <option key={node_id} value={node_id}>{nodes[node_id].name}</option>
            ))}
        </select>
        <br />
        Destino:
        <select name="target" value={target} onChange={(e) => setTarget(e.target.value)}>
          <option hidden disabled value=""> -- </option>
          { Object.keys(nodes).filter((node_id) => node_id !== source)
            .map((node_id) => (
              <option key={node_id} value={node_id}>{nodes[node_id].name}</option>
            ))}
        </select>
        <br />
        <button type="button" onClick={createNewLink}>Crear enlace</button>
      </>
    );
  }
  return (
    <div className="comp">{ content }</div>
  );
};

export default CreateLink;
