import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createGraph } from '../../slices/graphSlice';
import Button from '../common/Button';

const NewGraph = () => {
  const [name, setName] = useState('');
  const dispatch = useDispatch();

  const onChange = (e) => setName(e.target.value);

  return (
    <div className="comp">
      <label>Nombre</label>
      <input type="text" name="name" onChange={onChange} value={name} />
      <br />
      <Button
        text="Crear grafo nuevo"
        onClick={() => dispatch(createGraph({ name }))}
      />
    </div>
  );
};

export default NewGraph;
