import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import eye_off from '../../images/eye_off.png';
import eye_on from '../../images/eye_on.png';

const CollapsibleType = (props) => (
  <>
    <div className="collapsible">
      <details>
        <summary className="collapsible_button">
          <span style={{ display: 'inline-grid', gridTemplateColumns: '5fr 1fr 1fr', maxWidth: 'calc(100% - 20px)' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', overflow: 'hidden', textOverflow: 'ellipsis',
            }}
            >
              {props.title}
            </span>
            <button type="button" className="button" onClick={(e) => props.visibilityChange(props.id)}>
              { props.hidden ? (
                <img src={eye_off} style={{ height: '10px' }} />
              ) : (
                <img src={eye_on} style={{ height: '10px' }} />
              )}
            </button>
          </span>
        </summary>
        <div className="collapsibleContent">
          {props.children}
        </div>
      </details>
    </div>
    <input type="radio" name={props.group} value={props.id} onChange={props.defaultChange} />
  </>
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

export default CollapsibleType;
