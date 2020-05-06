import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';

import GraphsList from './GraphsList';
import NewGraph from './NewGraph';

export class Home extends Component {
  render() {
    return (
      <Fragment>
        <NewGraph />
        <br />
        <GraphsList />
      </Fragment>
    )
  }
}

export default Home;
