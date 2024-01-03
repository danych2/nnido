import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createGraph } from '../../actions/graphs';

const NewGraph = () => {
  const [name, setName] = useState('');
  const dispatch = useDispatch();

  const onChange = (e) => setName(e.target.value);

  const onSubmit = (e) => {
    e.preventDefault();
    const graph = { name };
    dispatch(createGraph(graph));
  };

  return (
    <div className="comp">
      <form onSubmit={onSubmit}>
        <label>Nombre</label>
        <input type="text" name="name" onChange={onChange} value={name} />
        <br />
        <button type="submit">Crear grafo nuevo</button>
      </form>
    </div>
  );
};

export default NewGraph;
