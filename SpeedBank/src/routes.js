import React from 'react';
import { IndexRoute, Link, Route } from 'react-router-dom';

import {
  App,
  Homepage,
  Login,
} from './containers';

// import higher order components
import { RequireAuth } from './components';

const Routes = props => (
  <Route>
    <Route>
      <Route path="/" component={RequireAuth(App)}>
        <IndexRoute component={Homepage} exact />
      </Route>
    </Route>
    <Route>
      <Route path="login" component={Login} />
    </Route>
  </Route>
);

export default Routes;
