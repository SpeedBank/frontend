import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';

import reducer from './redux/reducers';

const middleware = applyMiddleware(thunk);

export default createStore(reducer, middleware);
