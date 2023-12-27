import React from 'react';

import GraphsListComponent from './GraphsList';
import NewGraphComponent from './NewGraph';

function Home() {
  return (
    <>
      <NewGraphComponent />
      <br />
      <GraphsListComponent />
    </>
  );
}

export default Home;
