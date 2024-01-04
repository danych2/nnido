import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { createNode } from '../../slices/graphSlice';

const CreateNode = () => {
  const dispatch = useDispatch();
  const [newNode, setNewNode] = useState('');

  const createNewNode = (e) => {
    e.preventDefault();
    const node_data = { name: newNode };
    const node_position = { x: 0.5, y: 0.5 };
    dispatch(createNode({ data: node_data, position: node_position }));
    setNewNode('');
  };

  return (
    <div className="comp">
      <label>Nombre</label>
      <input autoComplete="off" type="text" onChange={(e) => setNewNode(e.target.value)} value={newNode} />
      <br />
      <button type="button" onClick={createNewNode}>Crear nodo</button>
    </div>
  );
};

export default CreateNode;
