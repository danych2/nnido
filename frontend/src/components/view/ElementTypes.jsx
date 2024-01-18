import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import {
  createNodeType, createLinkType, updateDefault, switchTypeFilter,
} from '../../slices/graphSlice';
import CollapsibleType from './CollapsibleType';

const ElementTypes = ({ isNodes }) => {
  const dispatch = useDispatch();

  const types = useSelector((state) => state.graph.graph.model[isNodes ? 'node_types' : 'link_types']);
  const typesFilter = useSelector(
    (state) => state.graph.graph.visualization[isNodes ? 'node_types_filtered' : 'link_types_filtered'],
  );

  const [newType, setNewType] = useState('');
  const createElementType = isNodes ? createNodeType : createLinkType;
  const createNewType = () => {
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
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 20px' }}>
      <b>{`Tipos de ${isNodes ? 'nodos' : 'enlaces'}`}</b>
      <input type="radio" name={isNodes ? 'node' : 'link'} value="" style={{ float: 'right' }} onChange={changeDefaultType} defaultChecked />
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
        />
      ))}
      <div className="comp" style={{ display: 'flex', alignItems: 'center', gridColumn: '1' }}>
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
        <div className="comp button" onClick={createNewType} style={{ minWidth: '1ch' }}>+</div>
      </div>
    </div>
  );
};

ElementTypes.propTypes = {
  isNodes: PropTypes.bool.isRequired,
};

export default ElementTypes;
