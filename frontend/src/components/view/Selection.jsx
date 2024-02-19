import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { GoTriangleRight, GoTriangleDown } from 'react-icons/go';

import SelectedElement from './SelectedElement';

const Selection = () => {
  const [isOpen, setIsOpen] = useState(false);

  let content = 'Ningún elemento seleccionado';

  const selection = useSelector((state) => state.graph.selection);

  if (selection.ids.length >= 1) {
    content = (
      <SelectedElement
        element_ids={selection.ids}
        element_class={selection.type}
        key={selection.ids[0]}
      />
    );
  }

  return (
    <div className="absolute top-0 right-0 bg-primary border-l border-b rounded-bl pl-1 pb-1 border-black">
      <div className="border rounded">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`cursor-pointer hover:bg-secondary p-1 ${isOpen ? 'rounded-t' : 'rounded'}`}
        >
          <span className="inline-flex items-center">
            {isOpen ? (
              <GoTriangleDown />
            ) : (
              <GoTriangleRight />
            )}
            Selección
          </span>
        </div>
        <div
          className="grid transition-all duration-500"
          style={{
            gridTemplateRows: isOpen ? '1fr' : '0fr',
          }}
        >
          <div className="overflow-hidden row-start-1 row-span-2">
            <div className="p-1 border-t">
              { content }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Selection;
