import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { updateLink } from '../../actions/graphs';

import EditableProperty from './EditableProperty';

const ActiveLink = ({ link_id }) => {
  const link = useSelector((state) => state.graph.graph.data.links[link_id]);

  const dispatch = useDispatch();

  const nodes = useSelector((state) => state.graph.graph.data.nodes);
  const linkTypes = useSelector((state) => state.graph.graph.model.link_types);

  const [newProperty, setNewProperty] = useState('');

  const onTypeChange = (e) => {
    dispatch(updateLink({
      id: link_id,
      data: {
        type: e.target.value,
      },
    }));
  };
  const addNewProperty = () => {
    setNewProperty('');
    dispatch(updateLink({
      id: link_id,
      data: {
        properties: {
          ...link.properties,
          [newProperty]: '',
        },
      },
    }));
  };

  let propertiesToShow = link.properties;
  if (link.type) {
    const typePropertyNames = Object.keys(linkTypes[link.type].properties);
    propertiesToShow = {
      ...propertiesToShow,
      ...typePropertyNames.reduce((dict, key) => (dict[key] = '', dict), {}),
    };
  }

  return (
    <>
      <b>Enlace seleccionado</b>
      <br />
      {`${nodes[link.source].name} - ${nodes[link.target].name}`}
      <br />
      Tipo:
      <select name="type" value={link.type} onChange={onTypeChange}>
        <option value=""> -- </option>
        { Object.keys(linkTypes).map((linkTypeId) => (
          <option key={linkTypeId} value={linkTypeId}>{linkTypes[linkTypeId].name}</option>
        ))}
      </select>
      <br />
      Propiedades:
      <br />
      { Object.keys(propertiesToShow).map((property) => (
        <EditableProperty key={property} name={property} initialValue={propertiesToShow[property]} elementType="link" elementId={link_id} />
      ))}
      <div className="comp">
        <input type="text" name="new_property" onChange={(e) => setNewProperty(e.target.value)} value={newProperty} />
        <button type="button" onClick={addNewProperty}>Añadir propiedad</button>
        <br />
      </div>
    </>
  );
};

ActiveLink.propTypes = {
  link_id: PropTypes.string.isRequired,
};

export default ActiveLink;
