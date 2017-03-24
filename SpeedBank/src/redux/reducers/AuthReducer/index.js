import {
  AUTH_ERROR,
  AUTH_REQUEST,
  AUTH_USER,
  PROTECTED_TEST,
  UNAUTH_USER,
} from '../../actions/types';

const INITIAL_STATE = {
  error: [],
  message: '',
  content: '',
  authenticated: false,
  fetching: false,
};

export function auth(state = INITIAL_STATE, action) {
  switch (action.type) {
    case AUTH_REQUEST:
      return { ...state, fetching: true };
    case AUTH_USER:
      return {
        ...state,
        error: [],
        message: '',
        authenticated: true,
        fetching: false,
      };
    case UNAUTH_USER:
      return { ...state, authenticated: false, fetching: false };
    case AUTH_ERROR:
      return { ...state, error: action.payload, fetching: false };
    case PROTECTED_TEST:
      return { ...state, content: action.payload };
    // no default
  }
  return state;
}
