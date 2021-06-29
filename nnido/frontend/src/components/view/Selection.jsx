import React from 'react';
import { useSelector } from 'react-redux';

import SelectedElement from './SelectedElement';

const Selection = () => {
  let content = 'Ningún elemento seleccionado';

  const selection = useSelector((state) => state.graph.selection);

  if (selection.ids.length >= 1) {
    content = (
      <SelectedElement
        element_ids={selection.ids}
        element_type={selection.type}
        key={selection.ids[0]}
      />
    );
  }

  return (
    <div className="comp">{ content }</div>
  );
};

export default Selection;
