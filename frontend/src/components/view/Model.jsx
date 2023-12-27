import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import NodeTypes from './NodeTypes';
import LinkTypes from './LinkTypes';

const Model = () => (
  <div className="comp">
    <NodeTypes />
    <br />
    <LinkTypes />
  </div>
);

export default Model;
