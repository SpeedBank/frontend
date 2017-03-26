const payWithCaptureAuth = require('./pwcAuthenticationService');
let q = require('Q');
const axios = require('axios');
const url = require('../config/external-services').speedBankUrl;
const graphqlUrl = require('../config/external-services').speedBankGraphUrl;

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
  mutationString = `
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
  const url = `${graphqlUrl}${mutationQuery}`;
  console.log('Query url', url);
  return axios.post(url);
}

module.exports = {
  pwcAuthenticate,
  login,
  signUp
};
