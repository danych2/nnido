import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { updateNode, updateLink } from '../../actions/graphs';
import TextInput from './TextInput';

const EditableProperty = ({
  name, initialValue, elementType, elementId, inherited, updateFunction, multipleValues,
}) => {
  const dispatch = useDispatch();

  const properties = useSelector((state) => {
    if (elementType === 'node') return state.graph.graph.data.nodes[elementId].properties;
    return state.graph.graph.data.links[elementId].properties;
  });

  const InputProperty = (
    <TextInput
      initialValue={initialValue}
      saveFunction={(propertyValue) => {
        const newProperties = {
          ...properties,
          [name]: propertyValue,
        };
        // If the value of a type-inherited property is erased, the property is deleted,
        // so that the property will not stay if the type changes
        if (inherited && propertyValue === '') {
          delete newProperties[name];
        }
        updateFunction(newProperties);
      }}
      multipleValues={multipleValues}
    />
  );

  let deleteButton = '';
  if (!inherited) {
    deleteButton = (
      <div
        className="comp"
        style={{ minWidth: '1ch' }}
        onClick={() => {
          delete properties[name];
          updateFunction(properties);
        }}
      >
        X
      </div>
    );
  }

  return (
    <div style={{ height: '1.8em', display: 'flex', alignItems: 'center' }}>
      <div style={{ flexGrow: 1, display: 'flex' }}>
        <div style={{ flexGrow: 1 }}>
          {name}
          :
        </div>
        <div style={{ flexGrow: 2 }}>
          {InputProperty}
        </div>
      </div>
      {deleteButton}
    </div>
  );
};

EditableProperty.propTypes = {
  name: PropTypes.string.isRequired,
  initialValue: PropTypes.string.isRequired,
  elementType: PropTypes.string.isRequired,
  elementId: PropTypes.string.isRequired,
  inherited: PropTypes.bool,
  updateFunction: PropTypes.func.isRequired,
  multipleValues: PropTypes.bool,
};
EditableProperty.defaultProps = {
  inherited: false,
  multipleValues: false,
};

export default EditableProperty;
