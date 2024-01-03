import { configureStore } from '@reduxjs/toolkit';
import graphReducer from './reducers/graph';
import authReducer from './reducers/auth';

const store = configureStore({
  // Automatically calls `combineReducers`
  reducer: {
    graph: graphReducer,
    auth: authReducer,
  },
});

export default store;
