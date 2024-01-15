import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteGraph } from '../../slices/graphSlice';
import Button from '../common/Button';
import './GraphCard.css';

const GraphCard = ({ id, name, date }) => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  return (
    <div className="card" key={id}>
      <div className="card_info">
        <Link to={`/view/${id}`}>
          {name}
          <br />
          <br />
          <small>{`Creado el ${new Date(date).toLocaleDateString()}`}</small>
        </Link>
      </div>
      {!!user && <Button text="Eliminar grafo" onClick={() => dispatch(deleteGraph(id))} styleClass="card_delete_button" />}
    </div>
  );
};

GraphCard.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
};

export default GraphCard;
