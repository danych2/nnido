import React, { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { SketchPicker } from 'react-color';

import { updateLinkType } from '../../actions/graphs';
import { useColorChooser } from '../../func';
import config from '../../config';

const EditLinkType = ({ linkTypeId }) => {
  const dispatch = useDispatch();

  const linkType = useSelector((state) => state.graph.graph.model.link_types[linkTypeId]);

  const [color, InputColor] = useColorChooser((color) => {
    dispatch(updateLinkType({
      id: linkTypeId,
      data: {
        color: color.hex,
      },
    }));
  }, linkType.color ? linkType.color : config.DEFAULT_LINK_COLOR);

  const [newProperty, setNewProperty] = useState('');
  const addProperty = () => {
    dispatch(updateLinkType({
      id: linkTypeId,
      data: {
        properties: {
          ...linkType.properties,
          [newProperty]: {},
        },
      },
    }));
    setNewProperty('');
  };

  const onDirectedChange = (e) => {
    dispatch(updateLinkType({
      id: linkTypeId,
      data: {
        directed: e.target.checked,
      },
    }));
  };

  return (
    <>
      <span style={{ fontSize: 'x-small' }}>{linkTypeId}</span>
      <br />
      Dirigido?
      <input name="directed" type="checkbox" checked={linkType.directed} onChange={onDirectedChange} />
      {InputColor}
      <br />
      Atributos:
      <br />
      { Object.keys(linkType.properties).map((property) => (
        <Fragment key={property}>
          <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }}>{property}</span>
          <br />
        </Fragment>
      ))}
      <input type="text" onChange={(e) => setNewProperty(e.target.value)} value={newProperty} />
      <button type="button" onClick={addProperty}>+</button>
      <br />
    </>
  );
};

EditLinkType.propTypes = {
  linkTypeId: PropTypes.string.isRequired,
};

export default EditLinkType;
