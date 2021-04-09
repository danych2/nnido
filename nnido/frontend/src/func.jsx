import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { SketchPicker } from 'react-color';

export const dictFilter = (obj, predicate) => Object.keys(obj)
  .filter((key) => predicate(obj[key]))
  .reduce((res, key) => (res[key] = obj[key], res), {});

export function normalizeCoords(x, y) {
  const boundRect = document.getElementById('graph_container').getBoundingClientRect();
  const { width, height } = boundRect;
  let normX, normY;
  if (width > height) {
    normX = (x - (width - height) / 2) / height;
    normY = y / height;
  } else {
    normX = x / width;
    normY = (y - (height - width) / 2) / width;
  }
  return { x: normX, y: normY };
}

export function denormalizeCoords(x, y) {
  const boundRect = document.getElementById('graph_container').getBoundingClientRect();
  const { width, height } = boundRect;
  let denormX, denormY;
  if (width > height) {
    denormX = x * height + (width - height) / 2;
    denormY = y * height;
  } else {
    denormX = x * width;
    denormY = y * width + (height - width) / 2;
  }
  return { x: denormX, y: denormY };
}

export function useTextInput(saveFunction, initialValue = '') {
  const [value, setValue] = useState(initialValue);
  const input = (
    <input
      style={{ width: '90%' }}
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyUp={(e) => { if (e.keyCode === 13) { e.target.blur(); } }}
      onBlur={saveFunction}
    />
  );
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);
  return [value, input];
}

export function useColorChooser(saveFunction, initialValue = '#FFF') {
  const [displayColorChooser, setDisplayColorChooser] = useState(false);
  const [value, setValue] = useState(initialValue);
  const input = (
    <div>
      <div onClick={(e) => setDisplayColorChooser(!displayColorChooser)}>
        <div style={{
          width: '36px',
          height: '14px',
          borderRadius: '2px',
          background: initialValue,
        }}
        />
      </div>
      { displayColorChooser ? (
        <div>
          <div onClick={() => setDisplayColorChooser(false)} />
          <SketchPicker
            color={initialValue}
            onChange={saveFunction}
          />
        </div>
      ) : null }
    </div>
  );
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);
  return [value, input];
}

export function getTextWidth(text, font) {
  // From https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript#answer-21015393
  // if given, use cached canvas for better performance
  // else, create new canvas
  const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement('canvas'));
  const context = canvas.getContext('2d');
  context.font = font;
  const metrics = context.measureText(text);
  return metrics.width;
}

export const CollapsibleType = (props) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="collapsible">
      <div style={{ display: 'grid', gridTemplateColumns: '5fr 1fr 1fr' }}>
        <span
          onClick={(e) => setOpen(!open)}
          onKeyPress={(e) => setOpen(!open)}
        >
          {props.title}
        </span>
        <button type="button" onClick={(e) => props.visibilityChange(props.id)}>
          { props.hidden ? (
            <img src="../../static/icons/eye_off.png" style={{ height: '10px' }} />
          ) : (
            <img src="../../static/icons/eye_on.png" style={{ height: '10px' }} />
          )}
        </button>
        <input type="radio" name={props.group} value={props.id} onChange={props.defaultChange} />
      </div>
      {open ? (
        <div className="collapsibleContent">
          {props.children}
        </div>
      ) : null}
    </div>
  );
};

CollapsibleType.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  group: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  hidden: PropTypes.bool.isRequired,
  defaultChange: PropTypes.func.isRequired,
  visibilityChange: PropTypes.func.isRequired,
};
