import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import eye_off from '../../images/eye_off.png';
import eye_on from '../../images/eye_on.png';
import EditType from './EditType';

import './CollapsibleType.css';

const CollapsibleType = ({
  title, isNode, pos, id, hidden, defaultChange, visibilityChange,
}) => {
  const type = useSelector((state) => {
    if (isNode) {
      return state.graph.graph.model.node_types[id];
    }
    return state.graph.graph.model.link_types[id];
  });

  const approximateSize = `calc(${Object.keys(type.attributes).length} * 1.5em + 10em)`;

  const [open, setOpen] = useState(false);
  return (
    <>
      <div
        className="collapsible_background"
        style={{ gridRow: `${pos * 2 + 2} / ${pos * 2 + 4}` }}
      />
      <div
        className={`collapsible_button ${open ? 'open' : 'closed'}`}
        onClick={() => setOpen(!open)}
        style={{ gridRow: `${pos * 2 + 2}` }}
      >
        <span style={{ display: 'inline-grid', gridTemplateColumns: '5fr 1fr', maxWidth: 'calc(100% - 20px)' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', overflow: 'hidden', textOverflow: 'ellipsis',
          }}
          >
            {title}
          </span>
          <button type="button" className="button" onClick={(e) => visibilityChange(id)}>
            { hidden ? (
              <img src={eye_off} style={{ height: '10px' }} />
            ) : (
              <img src={eye_on} style={{ height: '10px' }} />
            )}
          </button>
        </span>
      </div>
      <input
        className="collapsible_radio"
        type="radio"
        name={isNode ? 'node' : 'link'}
        value={id}
        onChange={defaultChange}
        style={{ gridRow: `${pos * 2 + 2}` }}
      />
      <div
        className={`collapsible_content ${open ? 'open' : 'closed'}`}
        style={{ gridRow: `${pos * 2 + 3}`, maxHeight: open ? approximateSize : '0px' }}
      >
        <EditType element_class={isNode ? 'node' : 'link'} typeId={id} />
      </div>
    </>
  );
};

CollapsibleType.propTypes = {
  title: PropTypes.string.isRequired,
  isNode: PropTypes.bool.isRequired,
  pos: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  hidden: PropTypes.bool.isRequired,
  defaultChange: PropTypes.func.isRequired,
  visibilityChange: PropTypes.func.isRequired,
};

export default CollapsibleType;
