// There are three possible states for our login
// process and we need actions for each of them
// import axios from 'axios';
import cookie from 'react-cookie';
import { browserHistory } from 'react-router';

import {
  AUTH_ERROR,
  AUTH_REQUEST,
  AUTH_USER,
  UNAUTH_USER,
} from './types';
import getHeaderConfig from './headerConfig';
import { API_URL, CLIENT_ROOT_URL } from './index';

export function loginRequest() {
  return { type: AUTH_REQUEST };
}

export function logoutUser() {
  return (dispatch) => {
    dispatch({ type: UNAUTH_USER });
    cookie.remove('token', { path: '/' });
    const path = `${CLIENT_ROOT_URL}/login`;
    browserHistory.push(path);
  };
}

function errorHandler(dispatch, error, type) {
  let errorMessage = [''];

  if (error.data.error) {
    errorMessage = [error.data.error];
  } else if (error.data.non_field_errors) {
    errorMessage = error.data.non_field_errors;
  } else if (error.data) {
    errorMessage = [error.data];
  } else {
    errorMessage = [error];
  }

  if (error.status === 401) {
    dispatch({
      type,
      payload: [
        'You are not authorized to do this. Please login and try again.',
      ],
    });
    logoutUser();
  } else {
    dispatch({
      type,
      payload: errorMessage,
    });
  }
}

function post() {
  const payload = {
    data: {
      token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
              eyJpc3MiOiJ0b3B0YWwuY29tIiwiZXhwIjoxNDI2NDIwODAwLCJodHRwOi8vdG9wdGFsLmNvbS9qd3RfY2xhaW1zL2lzX2FkbWluIjp0cnVlLCJjb21wYW55IjoiVG9wdGFsIiwiYXdlc29tZSI6dHJ1ZX0.
              yRQYnWzskCZUxPwaQupWkiUzKELZ49eM7oWxAQK_ZXw`,
    },
  };

  return new Promise((resolve, reject) => {
    if (payload) {
      resolve(payload);
    } else {
      reject({ response: 'ERROR!!!' });
    }
  });
}

const axios = {
  post,
};

export function loginUser({ username, password }) {
  loginRequest();
  return (dispatch) => {
    axios.post(`${API_URL}/auth/login`, { username, password })
      .then((response) => {
        cookie.save('token', response.data.token, { path: '/' });
        dispatch({ type: AUTH_USER });
        const path = `${CLIENT_ROOT_URL}/dashboard`;
        browserHistory.push(path);
      })
      .catch((error) => {
        errorHandler(dispatch, error.response, AUTH_ERROR);
      });
  };
}
