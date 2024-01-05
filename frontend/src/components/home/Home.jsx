import React from 'react';
import { useSelector } from 'react-redux';

import GraphsListComponent from './GraphsList';
import NewGraphComponent from './NewGraph';

const Home = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return (
    <>
      {isAuthenticated && <NewGraphComponent /> }
      <br />
      <GraphsListComponent />
    </>
  );
};

export default Home;
