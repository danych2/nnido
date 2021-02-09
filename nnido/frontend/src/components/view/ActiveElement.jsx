import React from 'react';
import { useSelector } from 'react-redux';

import ActiveNode from './ActiveNode';
import ActiveLink from './ActiveLink';

const ActiveElement = () => {
  let content = 'Ningún elemento seleccionado';

  const activeElement = useSelector((state) => state.graph.selection);

  if (activeElement && activeElement.id) {
    if (activeElement.type.localeCompare('node') === 0) {
      content = <ActiveNode key={activeElement.id} node_id={activeElement.id} />;
    } else if (activeElement.type.localeCompare('link') === 0) {
      content = <ActiveLink key={activeElement.id} link_id={activeElement.id} />;
    }
  }

  if (activeElement && activeElement.ids) {
    content = 'Múltiples elmentos seleccionados.';
  }

  return (
    <div className="comp">{ content }</div>
  );
};

export default ActiveElement;
