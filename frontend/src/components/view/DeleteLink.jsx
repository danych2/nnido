import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { deleteLink } from '../../slices/graphSlice';

const DeleteLink = () => {
  const dispatch = useDispatch();
  const links = useSelector((state) => state.graph.graph.data.links);
  const nodes = useSelector((state) => state.graph.graph.data.nodes);

  const [linkId, setLinkId] = useState('');

  const onDeleteLink = (e) => {
    e.preventDefault();
    if (linkId !== '') {
      dispatch(deleteLink(linkId));
    }
  };

  let content = 'Crea algún enlace antes de poder eliminar algún enlace';
  if (Object.keys(links).length > 0) {
    content = (
      <>
        Enlace:
        <select value={linkId} onChange={(e) => setLinkId(e.target.value)}>
          <option hidden disabled value=""> -- </option>
          { Object.keys(links).map((link_id) => (
            <option key={link_id} value={link_id}>
              { `${nodes[links[link_id].source].name} - ${nodes[links[link_id].target].name}`}
            </option>
          ))}
        </select>
        <br />
        <button type="button" onClick={onDeleteLink}>Eliminar enlace</button>
      </>
    );
  }

  return (
    <div className="comp">{ content }</div>
  );
};

export default DeleteLink;
