import React from 'react';
import { useSelector } from 'react-redux';

import GraphsListComponent from './GraphsList';
import NewGraphComponent from './NewGraph';

const Home = () => {
  const user = useSelector((state) => state.auth.user);
  return (
    <>
      {user && <NewGraphComponent /> }
      <br />
      <GraphsListComponent />
    </>
  );
};

export default Home;
