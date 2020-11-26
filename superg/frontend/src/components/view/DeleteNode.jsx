import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { deleteNode } from '../../actions/graphs';

const DeleteNode = () => {
  const dispatch = useDispatch();
  const nodes = useSelector((state) => state.graph.graph.data.nodes);

  const [nodeId, setNodeId] = useState('');

  const onDeleteNode = (e) => {
    e.preventDefault();
    if (nodeId !== '') {
      dispatch(deleteNode(nodeId));
    }
  };

  let content = 'Crea algún nodo antes de poder eliminar algún nodo';
  if (Object.keys(nodes).length > 0) {
    content = (
      <>
        Nodo:
        <select value={nodeId} onChange={(e) => setNodeId(e.target.value)}>
          <option hidden disabled value=""> -- </option>
          { Object.keys(nodes).map((node_id) => (
            <option key={node_id} value={node_id}>{nodes[node_id].name}</option>
          ))}
        </select>
        <br />
        <button type="button" onClick={onDeleteNode}>Eliminar nodo</button>
      </>
    );
  }
  return (
    <div className="comp">{ content }</div>
  );
};

export default DeleteNode;
