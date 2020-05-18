import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import NodeTypes from './NodeTypes'
import LinkTypes from './LinkTypes'

export class Model extends Component {

  render() {
    return (
      <div className="comp">Modelo
        <NodeTypes />
        <LinkTypes />
      </div>
    )
  };
}

export default Model;