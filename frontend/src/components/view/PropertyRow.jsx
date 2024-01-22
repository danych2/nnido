/* eslint-disable prefer-destructuring */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { FaTimes, FaUndo } from 'react-icons/fa';

import TextInput from './TextInput';
import ColorInput from './ColorInput';
import CheckboxInput from './CheckboxInput';
import DropdownInput from './DropdownInput';
import { updateProperty, deleteProperty } from '../../slices/graphSlice';
import properties from '../../properties';

const PropertyRow = ({
  property_id,
  element_class,
  element_ids,
  selectedElements, // TODO: is this argument (selectedElements) really necessary?
  is_type,
  isActive,
}) => {
  const dispatch = useDispatch();

  const propertyConfig = properties[property_id];
  const isMultiple = element_ids.length > 1;
  const multipleValues = isMultiple
    && new Set(selectedElements.map((object) => object[property_id])).size > 1;
  const initialValue = selectedElements[0][property_id] || propertyConfig.default;

  let Input;

  const updateFunction = function updateFunction(value) {
    dispatch(updateProperty({
      isType: is_type,
      isNode: element_class.localeCompare('node') === 0,
      ids: element_ids,
      property: property_id,
      value,
    }));
  };

  const deleteFunction = function deleteFunction() {
    dispatch(deleteProperty({
      isType: is_type,
      isNode: element_class.localeCompare('node') === 0,
      ids: element_ids,
      property: property_id,
    }));
  };

  switch (propertyConfig.type) {
    case 'text':
      Input = (
        <TextInput
          initialValue={initialValue}
          saveFunction={(value) => {
            dispatch(updateFunction(value));
          }}
          multipleValues={multipleValues}
        />
      );
      break;
    case 'color':
      Input = (
        <ColorInput
          initialValue={initialValue}
          saveFunction={(value) => {
            updateFunction(value.hex);
          }}
          multipleValues={multipleValues}
        />
      );
      break;
    case 'checkbox':
      Input = (
        <CheckboxInput
          initialValue={initialValue}
          saveFunction={(value) => {
            updateFunction(value);
          }}
          multipleValues={multipleValues}
        />
      );
      break;
    case 'dropdown':
      Input = (
        <DropdownInput
          initialValue={initialValue}
          options={propertyConfig.options}
          saveFunction={(value) => {
            updateFunction(value);
          }}
          multipleValues={multipleValues}
          isActive={isActive}
        />
      );
      break;
    default:
      Input = 'ERROR';
  }

  return (
    <>
      <div style={{ gridColumnStart: '1' }}>{`${propertyConfig.name}:`}</div>
      <div style={{ gridColumnStart: '2' }}>{Input}</div>
      <div style={{ gridColumnStart: '3' }}>{isActive && !isMultiple ? <button type="button" className="small_button" onClick={deleteFunction}><FaUndo /></button> : ''}</div>
    </>
  );
};

PropertyRow.propTypes = {
  property_id: PropTypes.string.isRequired,
  element_class: PropTypes.string.isRequired,
  element_ids: PropTypes.array.isRequired,
  selectedElements: PropTypes.array.isRequired,
  is_type: PropTypes.bool.isRequired,
  isActive: PropTypes.bool.isRequired,
};

export default PropertyRow;
