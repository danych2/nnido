import React, { useState } from 'react';
import PropTypes from 'prop-types';

const CheckboxInput = ({
  initialValue, saveFunction, multipleValues,
}) => (
  <input
    className={multipleValues ? 'multiple_values' : ''}
    type="checkbox"
    checked={initialValue}
    onChange={(e) => {
      saveFunction(e.target.checked);
    }}
  />
);

CheckboxInput.propTypes = {
  initialValue: PropTypes.bool.isRequired,
  saveFunction: PropTypes.func.isRequired,
  multipleValues: PropTypes.bool,
};
CheckboxInput.defaultProps = {
  multipleValues: false,
};

export default CheckboxInput;
