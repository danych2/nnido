import React, { Fragment, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { createNodeType, updateDefault, switchTypeFilter } from '../../slices/graphSlice';
import { CollapsibleType } from '../../func';
import EditType from './EditType';

const NodeTypes = () => {
  const dispatch = useDispatch();

  const nodeTypes = useSelector((state) => state.graph.graph.model.node_types);
  const nodeTypesFilter = useSelector(
    (state) => state.graph.graph.visualization.node_types_filtered,
  );

  const [newNodeType, setNewNodeType] = useState('');
  const createNewType = () => {
    dispatch(createNodeType({
      name: newNodeType,
    }));
    setNewNodeType('');
  };

  const changeDefaultNodeType = (e) => {
    dispatch(updateDefault({
      name: 'defaultNodeType',
      value: e.currentTarget.value,
    }));
  };

  const changeNodeTypeVisibility = (id) => {
    dispatch(switchTypeFilter({ isNode: true, id }));
  };

  return (
    <div>
      <b>Tipos de nodos</b>
      <input type="radio" name="node" value="" style={{ float: 'right' }} onChange={changeDefaultNodeType} defaultChecked />
      <br />
      { Object.keys(nodeTypes).map((nodeTypeId) => (
        <CollapsibleType
          key={nodeTypeId}
          id={nodeTypeId}
          title={nodeTypes[nodeTypeId].name}
          hidden={!!nodeTypesFilter[nodeTypeId]}
          //      ^ double negation used to convert undefined (default) values to false
          defaultChange={changeDefaultNodeType}
          visibilityChange={changeNodeTypeVisibility}
          group="node"
        >
          <EditType element_class="node" typeId={nodeTypeId} />
        </CollapsibleType>
      ))}
      <div className="comp" style={{ display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          name="new_nodetype"
          onKeyUp={(e) => {
            if (e.keyCode === 13) {
              createNewType();
            }
          }}
          onChange={(e) => setNewNodeType(e.target.value)}
          value={newNodeType}
          style={{ flexGrow: 1 }}
        />
        <div className="comp button" onClick={createNewType} style={{ minWidth: '1ch' }}>+</div>
      </div>
    </div>
  );
};

export default NodeTypes;
