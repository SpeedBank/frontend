import React from 'react';
import { IndexRoute, Route, Router } from 'react-router';

import {
  App,
  Homepage,
  Login,
} from './containers';

// import higher order components
// import { RequireAuth } from './components';
import RequireAuth from './components/RequireAuth';

const Routes = props => (
  <Router {...props}>
    <Route>
      <Route path="/" component={RequireAuth(App)}>
        <IndexRoute component={Homepage} />
      </Route>
    </Route>
    <Route>
      <Route path="login" component={Login} />
    </Route>
  </Router>
);

export default Routes;
