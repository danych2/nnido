import React, { useState } from 'react';
import { GoTriangleRight, GoTriangleDown } from 'react-icons/go';
import ElementTypes from './ElementTypes';

const Model = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(null);

  return (
    <div className="w-72 absolute top-0 left-0 bg-primary border-r border-b rounded-br pr-1 pb-1 border-black max-h-full">
      <div className="border max-h-full rounded">
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
            Modelo
          </span>
        </div>
        <div
          className="overflow-hidden"
          style={{
            height: isOpen ? 'auto' : 0,
          }}
        >
          <div className="p-1 border-t">
            <ElementTypes
              isNodes
              expandedIndex={expandedIndex}
              setExpandedIndex={setExpandedIndex}
            />
            <ElementTypes
              isNodes={false}
              expandedIndex={expandedIndex}
              setExpandedIndex={setExpandedIndex}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Model;
