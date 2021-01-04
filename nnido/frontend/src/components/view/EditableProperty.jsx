import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { useTextInput } from '../../func';
import { updateNode, updateLink } from '../../actions/graphs';

const EditableProperty = ({
  name, initialValue, elementType, elementId,
}) => {
  const dispatch = useDispatch();

  const properties = useSelector((state) => {
    if (elementType === 'node') return state.graph.graph.data.nodes[elementId].properties;
    return state.graph.graph.data.links[elementId].properties;
  });

  const [propertyValue, InputProperty] = useTextInput(() => {
    const newProperties = {
      ...properties,
      [name]: propertyValue,
    };
    if (propertyValue === '') {
      delete newProperties[name];
    }
    if (elementType === 'node') {
      dispatch(updateNode({
        id: elementId,
        data: {
          properties: newProperties,
        },
      }));
    } else {
      dispatch(updateLink({
        id: elementId,
        data: {
          properties: newProperties,
        },
      }));
    }
  }, initialValue);

  return (
    <>
      {name}
      :
      {InputProperty}
      <br />
    </>
  );
};

EditableProperty.propTypes = {
  name: PropTypes.string.isRequired,
  initialValue: PropTypes.string.isRequired,
  elementType: PropTypes.string.isRequired,
  elementId: PropTypes.string.isRequired,
};

export default EditableProperty;
