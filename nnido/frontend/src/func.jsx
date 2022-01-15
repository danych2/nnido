import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import properties from './properties';

export function getAttribute(graph, id, attribute_name, type) {
  let value;
  if (type.localeCompare('node') === 0) {
    if (graph.data.nodes[id].type) {
      value = graph.model.node_types[graph.data.nodes[id].type].attributes[attribute_name] || value;
    }
    value = graph.data.nodes[id].attributes[attribute_name] || value;
  } else {
    if (graph.data.links[id].type) {
      value = graph.model.link_types[graph.data.links[id].type].attributes[attribute_name] || value;
    }
    value = graph.data.links[id].attributes[attribute_name] || value;
  }
  return value;
}

export function getAttributeMini(types, element, attribute_name) {
  let value = '';
  if (element.type) {
    value = types[element.type].attributes[attribute_name] || value;
  }
  value = element.attributes[attribute_name] || value;
  return value;
}

export function getSystemProperty(graph, element_id, property_id, element_class) {
  let value;
  const isNode = element_class.localeCompare('node') === 0;
  const element = isNode ? graph.data.nodes[element_id] : graph.data.links[element_id];
  const types = isNode ? graph.model.node_types : graph.model.link_types;
  const property = properties[property_id];
  if (element[property_id]) {
    value = element[property_id];
  } else if (!property.individualProperty && element.type && types[element.type][property_id]) {
    value = types[element.type][property_id];
  } else value = property.default;
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
