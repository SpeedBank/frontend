import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { browserHistory } from 'react-router';

// import Routes from './routes';
import store from './store';
import './index.css';

import { IndexRoute, Route, Router } from 'react-router';

// import {
//   App,
//   Homepage,
//   Login,
// } from './containers';
import App from './containers/App';
import HomePage from './containers/HomePage';
import Login from './containers/Login';
// import higher order components
// import { RequireAuth } from './components';
import RequireAuth from './components/RequireAuth';


ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route>
        <Route path="/" component={RequireAuth(App)}>
          <IndexRoute component={HomePage} />
        </Route>
      </Route>
      <Route>
        <Route path="login" component={Login} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);
