import React from 'react';

import GraphsList from './GraphsList';
import NewGraph from './NewGraph';

function Home() {
  return (
    <>
      <NewGraph />
      <br />
      <GraphsList />
    </>
  );
}

export default Home;
