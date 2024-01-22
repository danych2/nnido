import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { FaTimes } from 'react-icons/fa';

import TextInput from './TextInput';

const EditableAttribute = ({
  name, initialValue, elementClass, elementId, inherited,
  updateFunction, deleteFunction, multipleValues,
}) => {
  let deleteButton = '';
  if (!inherited) {
    deleteButton = (
      <button
        type="button"
        className="small_button"
        onClick={() => {
          deleteFunction();
        }}
      >
        <FaTimes />
      </button>
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
          <TextInput
            initialValue={initialValue}
            saveFunction={(value) => {
              /*
              TODO: Think better way to handle this
              // If the value of a type-inherited attribute is erased, the attribute is deleted,
              // so that the attribute will not stay if the type changes
              */
              updateFunction(value);
            }}
            multipleValues={multipleValues}
          />
        </div>
      </div>
      {deleteButton}
    </div>
  );
};

EditableAttribute.propTypes = {
  name: PropTypes.string.isRequired,
  initialValue: PropTypes.string.isRequired,
  elementClass: PropTypes.string.isRequired,
  elementId: PropTypes.string.isRequired,
  inherited: PropTypes.bool,
  updateFunction: PropTypes.func.isRequired,
  deleteFunction: PropTypes.func,
  multipleValues: PropTypes.bool,
};
EditableAttribute.defaultProps = {
  inherited: false,
  multipleValues: false,
  deleteFunction: undefined,
};

export default EditableAttribute;
