import React, { Component } from 'react';

import { Route } from 'react-router-dom';

import { Homepage } from '../'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Route path='/' component={Homepage} exact>
        </Route>
      </div>
    );
  }
}

export default App;
