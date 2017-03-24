import React from 'react';
import { connect } from 'react-redux';

function RequireAuth(ComposedComponent) {
  class Authentication extends React.Component {
    static contextTypes = {
      router: React.PropTypes.object,
    }

    componentWillMount() {
      if (!this.props.authenticated) {
        this.context.router.push('/login');
      }
    }

    componentWillUpdate(nextProps) {
      if (!nextProps.authenticated) {
        this.context.router.push('login');
      }
    }

    render() {
      return <ComposedComponent {...this.props} />;
    }
  }

  Authentication.propTypes = {
    authenticated: React.PropTypes.bool,
  };

  function mapStateToProps(state) {
    return { authenticated: state.auth.authenticated };
  }

  return connect(mapStateToProps)(Authentication);
}

export default RequireAuth;
