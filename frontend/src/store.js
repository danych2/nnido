import { configureStore } from '@reduxjs/toolkit';
import graphReducer from './slices/graphSlice';
import authReducer from './slices/authSlice';

const store = configureStore({
  // Automatically calls `combineReducers`
  reducer: {
    graph: graphReducer,
    auth: authReducer,
  },
});

export default store;
