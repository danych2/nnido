import React from 'react';
import { useSelector } from 'react-redux';

import SelectedElement from './SelectedElement';
import SelectedMultipleNodes from './SelectedMultipleNodes';

const Selection = () => {
  let content = 'Ningún elemento seleccionado';

  const selection = useSelector((state) => state.graph.selection);

  if (selection.ids.length === 1) {
    content = (
      <SelectedElement
        element_id={selection.ids[0]}
        element_type={selection.type}
        key={selection.ids[0]}
      />
    );
  } else if (selection.ids.length > 1 && selection.type.localeCompare('node') === 0) {
    content = <SelectedMultipleNodes node_ids={selection.ids} key={selection.ids.join('')} />;
  }

  return (
    <div className="comp">{ content }</div>
  );
};

export default Selection;
