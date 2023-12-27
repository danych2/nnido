import React from 'react';
import PropTypes from 'prop-types';

const DropdownInput = ({
  initialValue, options, saveFunction, multipleValues, isActive,
}) => (
  // TODO implement multiplevalues visuals
  <select
    className={multipleValues ? 'multiple_values' : ''}
    value={initialValue}
    onChange={(e) => saveFunction(e.target.value)}
  >
    { Object.keys(options).map((optionKey) => (
      <option key={optionKey} value={optionKey}>{options[optionKey]}</option>
    ))}
  </select>
);

DropdownInput.propTypes = {
  initialValue: PropTypes.string.isRequired,
  options: PropTypes.object.isRequired,
  saveFunction: PropTypes.func.isRequired,
  multipleValues: PropTypes.bool,
  isActive: PropTypes.bool.isRequired,
};
DropdownInput.defaultProps = {
  multipleValues: false,
};

export default DropdownInput;
