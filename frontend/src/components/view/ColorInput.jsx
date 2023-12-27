import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { CompactPicker } from 'react-color';

const ColorInput = ({
  initialValue, saveFunction, multipleValues,
}) => {
  const [value, setValue] = useState(initialValue);
  const [displayColorChooser, setDisplayColorChooser] = useState(false);

  useEffect(() => {
    function loseFocusEvent(e) {
      // TODO: make lose focus work also when moving cursor (like when creating a rubber band)
      const flyoutElement = document.getElementById('colorChooser');
      let targetElement = e.target; // clicked element
      do {
        if (targetElement === flyoutElement) {
          // This is a click inside. Do nothing, just return.
          return;
        }
        // Go up the DOM
        targetElement = targetElement.parentNode;
      } while (targetElement);
      // This is a click outside.
      setDisplayColorChooser(false);
    }
    if (displayColorChooser) {
      document.addEventListener('click', loseFocusEvent);
    }
    return () => { document.removeEventListener('click', loseFocusEvent); };
  });

  return (
    <span>
      <span
        style={{
          display: 'inline-block',
          width: '36px',
          height: '14px',
          borderRadius: '2px',
          background: initialValue,
          cursor: 'pointer',
        }}
        onClick={(e) => {
          setDisplayColorChooser(!displayColorChooser);
        }}
      />
      { displayColorChooser ? (
        <div
          id="colorChooser"
          style={{ position: 'absolute' }}
          onKeyUp={(e) => {
            if (e.keyCode === 13) {
              setDisplayColorChooser(!displayColorChooser);
            }
          }}
        >
          <div onClick={() => setDisplayColorChooser(false)} />
          <CompactPicker
            color={initialValue}
            onChange={saveFunction}
          />
        </div>
      ) : null }
    </span>
  );
};

ColorInput.propTypes = {
  initialValue: PropTypes.string.isRequired,
  saveFunction: PropTypes.func.isRequired,
  multipleValues: PropTypes.bool,
};
ColorInput.defaultProps = {
  multipleValues: false,
};

export default ColorInput;
