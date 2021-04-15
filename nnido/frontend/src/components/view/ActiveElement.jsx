import React from 'react';
import { useSelector } from 'react-redux';

import ActiveNode from './ActiveNode';
import ActiveLink from './ActiveLink';

const ActiveElement = () => {
  let content = 'Ningún elemento seleccionado';

  const selection = useSelector((state) => state.graph.selection);

  if (selection.ids.length === 1) {
    if (selection.type.localeCompare('node') === 0) {
      content = <ActiveNode key={selection.ids[0]} node_id={selection.ids[0]} />;
    } else if (selection.type.localeCompare('link') === 0) {
      content = <ActiveLink key={selection.ids[0]} link_id={selection.ids[0]} />;
    }
  }

  if (selection.ids.length > 1) {
    content = 'Múltiples elmentos seleccionados.';
  }

  return (
    <div className="comp">{ content }</div>
  );
};

export default ActiveElement;
