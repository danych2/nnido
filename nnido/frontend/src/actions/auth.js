import axios from 'axios';

import {
  USER_LOADING, USER_LOADED, AUTH_ERROR, LOGIN_SUCCESS,
  LOGIN_FAIL, LOGOUT_SUCCESS, REGISTER_SUCCESS, REGISTER_FAIL,
} from './types';

export const tokenConfig = (getState) => {
  const { token } = getState().auth;

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }

  return config;
};

// LOAD USER
export const loadUser = () => (dispatch, getState) => {
  dispatch({ type: USER_LOADING });

  axios.get('/api/auth/user', tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: USER_LOADED,
        payload: res.data,
      });
    }).catch(() => {
      dispatch({
        type: AUTH_ERROR,
      });
    });
};

// LOGIN
export const login = (username, password) => (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ username, password });

  axios.post('/api/auth/login', body, config)
    .then((res) => {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
      });
    }).catch(() => {
      dispatch({
        type: LOGIN_FAIL,
      });
    });
};

// REGISTER
export const register = ({ username, email, password }) => (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ username, email, password });

  axios.post('/api/auth/register', body, config)
    .then((res) => {
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });
    }).catch(() => {
      dispatch({
        type: REGISTER_FAIL,
      });
    });
};

// LOGOUT
export const logout = () => (dispatch, getState) => {
  axios.post('/api/auth/logout/', null, tokenConfig(getState))
    .then(() => {
      dispatch({
        type: LOGOUT_SUCCESS,
      });
    }).catch((err) => {
      console.log(err);
    });
};
