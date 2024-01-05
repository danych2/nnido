import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { deleteGraph } from '../../slices/graphSlice';
import Button from '../common/Button';

const GraphCard = ({ id, name, date }) => {
  const dispatch = useDispatch();
  return (
    <div className="comp" key={id}>
      <Link to={`/view/${id}`}>{name}</Link>
      <br />
      {`Creado el ${new Date(date).toLocaleDateString()}`}
      <br />
      <Button text="Eliminar grafo" onClick={() => dispatch(deleteGraph(id))} />
    </div>
  );
};

GraphCard.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
};

export default GraphCard;
