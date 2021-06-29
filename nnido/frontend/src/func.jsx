import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { CompactPicker } from 'react-color';

export function getUserProperty(graph, id, property_name, type) {
  let value;
  if (type.localeCompare('node') === 0) {
    if (graph.data.nodes[id].type) {
      value = graph.model.node_types[graph.data.nodes[id].type].properties[property_name] || value;
    }
    value = graph.data.nodes[id].properties[property_name] || value;
  } else {
    if (graph.data.links[id].type) {
      value = graph.model.link_types[graph.data.links[id].type].properties[property_name] || value;
    }
    value = graph.data.links[id].properties[property_name] || value;
  }
  return value;
}

export function getUserPropertyMini(types, element, property_name) {
  let value = '';
  if (element.type) {
    value = types[element.type].properties[property_name] || value;
  }
  value = element.properties[property_name] || value;
  return value;
}

export function getSystemProperty(graph, id, property_name, type) {
  let value = '';
  if (type.localeCompare('node') === 0) {
    if (graph.data.nodes[id].type) {
      value = graph.model.node_types[graph.data.nodes[id].type][property_name] || value;
    }
    value = graph.data.nodes[id][property_name] || value;
  } else {
    if (graph.data.links[id].type) {
      value = graph.model.link_types[graph.data.links[id].type][property_name] || value;
    }
    value = graph.data.links[id][property_name] || value;
  }
  return value;
}

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

export function useColorChooser(saveFunction, initialValue = '#FFF') {
  const [displayColorChooser, setDisplayColorChooser] = useState(false);
  const [value, setValue] = useState(initialValue);
  const randomId = Math.random().toString(36).slice(2);
  useEffect(() => {
    function loseFocusEvent(e) {
      // TODO: make lose focus work also when moving cursor (like when creating a rubber band)
      const flyoutElement = document.getElementById('colorChooser');
      let targetElement = e.target; // clicked element
      do {
        if (targetElement === flyoutElement) {
          console.log('click inside');
          // This is a click inside. Do nothing, just return.
          return;
        }
        // Go up the DOM
        targetElement = targetElement.parentNode;
      } while (targetElement);
      // This is a click outside.
      setDisplayColorChooser(false);
      console.log('click outside');
    }
    if (displayColorChooser) {
      document.addEventListener('click', loseFocusEvent);
    }
    return () => { document.removeEventListener('click', loseFocusEvent); };
  });

  const input = (
    <div>
      <div onClick={(e) => {
        setDisplayColorChooser(!displayColorChooser);
      }}
      >
        <div style={{
          width: '36px',
          height: '14px',
          borderRadius: '2px',
          background: initialValue,
        }}
        />
      </div>
      { displayColorChooser ? (
        <div
          id="colorChooser"
          style={{ position: 'absolute' }}
        >
          <div onClick={() => setDisplayColorChooser(false)} />
          <CompactPicker
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

export const CollapsibleType = (props) => (
  <div className="collapsible">
    <details>
      <summary className="button">
        <span style={{ display: 'inline-grid', gridTemplateColumns: '5fr 1fr 1fr', maxWidth: 'calc(100% - 20px)' }}>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {props.title}
          </span>
          <button type="button" className="button" onClick={(e) => props.visibilityChange(props.id)}>
            { props.hidden ? (
              <img src="../../static/icons/eye_off.png" style={{ height: '10px' }} />
            ) : (
              <img src="../../static/icons/eye_on.png" style={{ height: '10px' }} />
            )}
          </button>
          <input type="radio" name={props.group} value={props.id} onChange={props.defaultChange} />
        </span>
      </summary>
      <div className="collapsibleContent">
        {props.children}
      </div>
    </details>
  </div>
);

CollapsibleType.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  group: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  hidden: PropTypes.bool.isRequired,
  defaultChange: PropTypes.func.isRequired,
  visibilityChange: PropTypes.func.isRequired,
};
