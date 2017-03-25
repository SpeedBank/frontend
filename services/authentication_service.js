const payWithCaptureAuth = require('./pwcAuthenticationService');
const q = require('q');
const axios = require('axios');
const url = 'https://speedbank.herokuapp.com/api/login';

function pwcAuthenticate(req, res) {
  var deferred = q.defer();
  if (!req.cookies.pwc_token) {
    payWithCaptureAuth.authenticate().then((pwcResponse) => {
      res.cookie('pwc_token', pwcResponse.data.access_token);
      deferred.resolve('success');
    })
    .catch((errResponse) => {
      deferred.reject('error');
    });
  }
  return deferred.promise;
}

function login(req, username = '', password = '') {
  var deferred = q.defer();
  const config = {
    auth: {
      username: req.body.username,
      password: req.body.password
    }
  };
  if (!req.cookies.userInfo) {
    return axios.post(url, {}, config);
  }
  deferred.resolve('loggedIn');
  return deferred.promise;
}

module.exports = {
  pwcAuthenticate,
  login
};
