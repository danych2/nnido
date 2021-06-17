import React, { Fragment, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { createLinkType, updateDefault, switchLinkTypeFilter } from '../../actions/graphs';
import { CollapsibleType } from '../../func';
import EditType from './EditType';

const LinkTypes = () => {
  const dispatch = useDispatch();

  const linkTypes = useSelector((state) => state.graph.graph.model.link_types);
  const linkTypesFilter = useSelector(
    (state) => state.graph.graph.visualization.link_types_filtered,
  );

  const [newLinkType, setNewLinkType] = useState('');
  const createNewType = () => {
    dispatch(createLinkType({
      name: newLinkType,
    }));
    setNewLinkType('');
  };

  const changeDefaultLinkType = (e) => {
    dispatch(updateDefault({
      name: 'defaultLinkType',
      value: e.currentTarget.value,
    }));
  };

  const changeLinkTypeVisibility = (id) => {
    dispatch(switchLinkTypeFilter({ id }));
  };

  return (
    <div>
      <b>Tipos de enlaces</b>
      <input type="radio" name="link" value="" style={{ float: 'right' }} onChange={changeDefaultLinkType} defaultChecked />
      <br />
      { Object.keys(linkTypes).map((linkTypeId) => (
        <CollapsibleType
          key={linkTypeId}
          id={linkTypeId}
          title={linkTypes[linkTypeId].name}
          hidden={!!linkTypesFilter[linkTypeId]}
          //      ^ double negation used to convert undefined (default) values to false
          defaultChange={changeDefaultLinkType}
          visibilityChange={changeLinkTypeVisibility}
          group="link"
        >
          <EditType element="link" typeId={linkTypeId} />
        </CollapsibleType>
      ))}
      <div className="comp" style={{ display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          name="new_property"
          onKeyUp={(e) => {
            if (e.keyCode === 13) {
              createNewType();
            }
          }}
          onChange={(e) => setNewLinkType(e.target.value)}
          value={newLinkType}
          style={{ flexGrow: 1 }}
        />
        <div className="comp button" onClick={createNewType} style={{ minWidth: '1ch' }}>+</div>
      </div>
    </div>
  );
};

export default LinkTypes;
