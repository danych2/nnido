import React, {
  useState, useRef, useEffect, useReducer,
} from 'react';
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
        className="overflow-hidden"
        style={{
          height: isOpen ? 'auto' : 0,
        }}
      >
        <div className="p-1 border-t">
          { content }
        </div>
      </div>
    </div>
  );
};

export default Selection;
