import React, { useState } from 'react';
import PropTypes from 'prop-types';

const TextInput = ({
  initialValue, saveFunction, multipleValues,
}) => {
  const [value, setValue] = useState(initialValue);
  const [edited, setEdited] = useState(false);
  return (
    <input
      className={multipleValues ? 'multiple_values' : ''}
      style={{ margin: '2px 0px', width: 'calc(100% - 6px)' }}
      type="text"
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
        setEdited(true);
      }}
      onKeyUp={(e) => {
        if (e.keyCode === 13) {
          setEdited(true);
          e.persist();
          setTimeout(() => { e.target.blur(); }, 1);
        }
      }}
      onBlur={() => {
        if (edited) {
          saveFunction(value);
          setEdited(false);
        }
      }}
    />
  );
};

TextInput.propTypes = {
  initialValue: PropTypes.string.isRequired,
  saveFunction: PropTypes.func.isRequired,
  multipleValues: PropTypes.bool,
};
TextInput.defaultProps = {
  multipleValues: false,
};

export default TextInput;
