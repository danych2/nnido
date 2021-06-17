import React from 'react';
import PropTypes from 'prop-types';

const DropdownInput = ({
  value, options, saveFunction, multipleValues,
}) => (
  // TODO implement multiplevalues visuals
  <select
    className={multipleValues ? 'multiple_values' : ''}
    value={value}
    onChange={(e) => saveFunction(e.target.value)}
  >
    <option value=""> -- </option>
    { Object.keys(options).map((optionKey) => (
      <option key={optionKey} value={optionKey}>{options[optionKey]}</option>
    ))}
  </select>
);

DropdownInput.propTypes = {
  value: PropTypes.string.isRequired,
  options: PropTypes.object.isRequired,
  saveFunction: PropTypes.func.isRequired,
  multipleValues: PropTypes.bool,
};
DropdownInput.defaultProps = {
  multipleValues: false,
};

export default DropdownInput;
