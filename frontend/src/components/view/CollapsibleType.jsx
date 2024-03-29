import React from 'react';
import PropTypes from 'prop-types';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { GoTriangleRight, GoTriangleDown } from 'react-icons/go';
import EditType from './EditType';

import './CollapsibleType.css';

const CollapsibleType = ({
  title, isNode, pos, id, hidden, defaultChange,
  visibilityChange, isExpanded, setExpandedIndex,
}) => (
  <>
    <div
      className="collapsible_background"
      style={{ gridRow: `${pos * 2 + 2} / ${pos * 2 + 4}` }}
    />
    <div
      className={`flex justify-between items-center gap-1 collapsible_button ${isExpanded ? 'open' : 'closed'}`}
      onClick={() => setExpandedIndex(isExpanded ? null : id)}
      style={{ gridRow: `${pos * 2 + 2}` }}
    >
      <span className="shrink-0">
        {isExpanded ? (
          <GoTriangleDown />
        ) : (
          <GoTriangleRight />
        )}
      </span>
      <span className="grow truncate">
        {title}
      </span>
      <button type="button" className="small_button" onClick={(e) => { e.stopPropagation(); visibilityChange(id); }}>
        { hidden ? (
          <FaRegEyeSlash />
        ) : (
          <FaRegEye />
        )}
      </button>
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
      className="col-start-1 grid transition-all duration-500"
      style={{ gridRow: `${pos * 2 + 3}`, gridTemplateRows: isExpanded ? '1fr' : '0fr' }}
    >
      <div className="overflow-hidden row-start-1 row-span-2">
        <div className="m-1 p-1">
          <EditType element_class={isNode ? 'node' : 'link'} typeId={id} />
        </div>
      </div>
    </div>
  </>
);

CollapsibleType.propTypes = {
  title: PropTypes.string.isRequired,
  isNode: PropTypes.bool.isRequired,
  pos: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  hidden: PropTypes.bool.isRequired,
  defaultChange: PropTypes.func.isRequired,
  visibilityChange: PropTypes.func.isRequired,
  isExpanded: PropTypes.bool.isRequired,
  setExpandedIndex: PropTypes.func.isRequired,
};

export default CollapsibleType;
