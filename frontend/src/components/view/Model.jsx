import React from 'react';
import ElementTypes from './ElementTypes';

const Model = () => (
  <div className="comp">
    <ElementTypes isNodes />
    <br />
    <ElementTypes isNodes={false} />
  </div>
);

export default Model;
