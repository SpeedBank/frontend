const payWithCaptureAuth = require('./pwcAuthenticationService');
let q = require('Q');
const axios = require('axios');
const url = require('../config/external-services').speedBankUrl;
const graphqlUrl = require('../config/external-services').speedBankGraphUrl;

function pwcAuthenticate(req, res) {
  var deferred = q.defer();
  if (!req.cookies.pwc_token) {
    payWithCaptureAuth.authenticate().then((pwcResponse) => {
      console.log('Made request', pwcResponse.data);
      res.cookie('pwc_token', pwcResponse.data.access_token);
      deferred.resolve('success');
    })
    .catch((errResponse) => {
      deferred.reject(errResponse);
    });
  } else {
    deferred.resolve('success');
  }
  return deferred.promise;
}

function login(req) {
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

function signUp (req) {
  const mutationString = `
    mutation {
      createUser(input: {
        userData: {
          firstName: "${req.body.firstName}",
          lastName: "${req.body.lastName}",
          username: "${req.body.userName}",
          email: "${req.body.email}",
          password: "${req.body.password}"
        }
      }){
        user{
          id,
          email
        }
      }
    }
  `
  const mutationQuery = encodeURIComponent(mutationString);
  const urlQuery = `${graphqlUrl}${mutationQuery}`;
  return axios.post(urlQuery);
}

function isLoggedIn(req) {
  console.log('Auth Cookie', req.cookies.use);
  if (!req.cookies.userInfo) {
    return false;
  }
  return true;
}

module.exports = {
  pwcAuthenticate,
  login,
  signUp,
  isLoggedIn
};
