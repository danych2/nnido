import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { FaPlus } from 'react-icons/fa';

import {
  createNodeType, createLinkType, updateDefault, switchTypeFilter,
} from '../../slices/graphSlice';
import CollapsibleType from './CollapsibleType';

import './ElementTypes.css';

const ElementTypes = ({
  isNodes, expandedIndex, setExpandedIndex,
}) => {
  const dispatch = useDispatch();

  const types = useSelector((state) => state.graph.graph.model[isNodes ? 'node_types' : 'link_types']);
  const typesFilter = useSelector(
    (state) => state.graph.graph.visualization[isNodes ? 'node_types_filtered' : 'link_types_filtered'],
  );

  const [newType, setNewType] = useState('');
  const createElementType = isNodes ? createNodeType : createLinkType;
  const createNewType = () => {
    if (newType === '') return;
    dispatch(createElementType({
      name: newType,
    }));
    setNewType('');
  };

  const changeDefaultType = (e) => {
    dispatch(updateDefault({
      name: isNodes ? 'defaultNodeType' : 'defaultLinkType',
      value: e.currentTarget.value,
    }));
  };

  const changeTypeVisibility = (id) => {
    dispatch(switchTypeFilter({ isNode: isNodes, id }));
  };

  return (
    <>
      <div>
        <b>{`Tipos de ${isNodes ? 'nodos' : 'enlaces'}`}</b>
      </div>
      <div
        className="grid"
        style={{
          gridTemplateColumns: 'minmax(0, 1fr) 20px',
          gridTemplateRows: `repeat(${Object.keys(types).length * 2 + 2}, auto)`,
        }}
      >
        <div className="active_button_background" />
        <div className="default_type">
          Predeterminado
        </div>
        <input className="default_radio" type="radio" name={isNodes ? 'node' : 'link'} value="" onChange={changeDefaultType} defaultChecked />
        { Object.keys(types).map((typeId, index) => (
          <CollapsibleType
            key={typeId}
            id={typeId}
            pos={index}
            title={types[typeId].name}
            hidden={!!typesFilter[typeId]}
            //      ^ double negation used to convert undefined (default) values to false
            defaultChange={changeDefaultType}
            visibilityChange={changeTypeVisibility}
            isNode={isNodes}
            isExpanded={expandedIndex === typeId}
            setExpandedIndex={setExpandedIndex}
          />
        ))}
        <div className="add_type">
          <input
            type="text"
            name={isNodes ? 'new_nodetype' : 'new_linktype'}
            onKeyUp={(e) => {
              if (e.keyCode === 13) {
                createNewType();
              }
            }}
            onChange={(e) => setNewType(e.target.value)}
            value={newType}
            style={{ flexGrow: 1 }}
          />
          <button className="small_button" type="button" onClick={createNewType}><FaPlus /></button>
        </div>
      </div>
    </>
  );
};

ElementTypes.propTypes = {
  isNodes: PropTypes.bool.isRequired,
  expandedIndex: PropTypes.string,
  setExpandedIndex: PropTypes.func.isRequired,
};

ElementTypes.defaultProps = {
  expandedIndex: null,
};

export default ElementTypes;
