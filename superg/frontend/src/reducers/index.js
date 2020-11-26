import { combineReducers } from 'redux';
import graph from './graph';
import auth from './auth';

export default combineReducers({
  graph,
  auth,
});
