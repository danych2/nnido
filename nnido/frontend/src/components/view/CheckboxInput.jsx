import React, { useState } from 'react';
import PropTypes from 'prop-types';

const CheckboxInput = ({
  value, saveFunction, multipleValues,
}) => (
  <input
    className={multipleValues ? 'multiple_values' : ''}
    style={{ width: '90%' }}
    type="text"
    checked={value}
    onChange={(e) => {
      saveFunction(e.target.value);
    }}
  />
);

CheckboxInput.propTypes = {
  value: PropTypes.string.isRequired,
  saveFunction: PropTypes.func.isRequired,
  multipleValues: PropTypes.bool,
};
CheckboxInput.defaultProps = {
  multipleValues: false,
};

export default CheckboxInput;
