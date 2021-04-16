import React, { Fragment, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { createNodeType, updateDefault, switchNodeTypeFilter } from '../../actions/graphs';
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
    dispatch(switchNodeTypeFilter({ id }));
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
          <EditType element="node" typeId={nodeTypeId} />
        </CollapsibleType>
      ))}
      <br />
      <div className="comp">
        <input autoComplete="off" type="text" onChange={(e) => setNewNodeType(e.target.value)} value={newNodeType} />
        <button type="button" onClick={createNewType}>+</button>
      </div>
    </div>
  );
};

export default NodeTypes;
