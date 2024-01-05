import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  isLoading: false,
  user: null,
};

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i += 1) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === (`${name}=`)) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

export const tokenConfig = (getState) => {
  const { token } = getState().auth;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken'),
    },
  };

  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }

  return config;
};

export const loadUser = createAsyncThunk('auth/loadUser', async (_, { getState }) => {
  const res = await axios.get('/api/auth/user', tokenConfig(getState));
  return res.data;
});

export const login = createAsyncThunk('auth/login', async ({ username, password }) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const body = JSON.stringify({ username, password });
  const res = await axios.post('/api/auth/login', body, config);
  return res.data;
});

export const register = createAsyncThunk('auth/register', async ({ username, password, email }) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const body = JSON.stringify({ username, email, password });
  const res = await axios.post('/api/auth/register', body, config);
  return res.data;
});

export const logout = createAsyncThunk('auth/logout', async (_, { getState }) => {
  await axios.post('/api/auth/logout', null, tokenConfig(getState));
});

const isSuccessfullAuthAction = isAnyOf(login.fulfilled, register.fulfilled);

const isCancelAuthAction = isAnyOf(
  login.rejected, register.rejected, loadUser.rejected, logout.fulfilled,
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadUser.pending, (state) => {
      state.isLoading = true;
    })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.isLoading = false;
        state.user = action.payload;
      })
      .addMatcher(isSuccessfullAuthAction, (state, action) => {
        localStorage.setItem('token', action.payload.token);
        state.isAuthenticated = true;
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addMatcher(isCancelAuthAction, (state) => {
        localStorage.removeItem('token');
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
      });
  },
});

export default authSlice.reducer;
