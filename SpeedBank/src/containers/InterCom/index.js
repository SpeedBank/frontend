import React from 'react';
import { IntercomAPI } from 'react-intercom';

export class App extends React.Component {
  render () {
    const user = {
      user_id: "322",
      email: "user.email@email.com",
      name: "name"
    };
 
    return (
      <div className="app">
        <IntercomAPI appID="qnducmrw" { ...user } />
      </div>
    );
  }
}
