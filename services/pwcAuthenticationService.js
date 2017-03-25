var axios = require('axios');
var querystring = require('querystring');

var pwcCredentials = require('../config/pwcCredentials');

var clientId = pwcCredentials.pwcCredentials.clientId;
var clientSecret = pwcCredentials.pwcCredentials.clientSecret;

function authenticate() {
  var data = {
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'client_credentials',
  };
  return axios.post('https://pwcstaging.herokuapp.com/oauth/token', querystring.stringify(data));
}

function getExpireTime(expiresIn) {
  var d = new Date();
  return d.setSeconds(3600);
}

function isValid(expireTime) {
  var now = new Date();
  var fullExpireTime = new Date(expire_time);
  if (now > fullExpireTime) {
    return false;
  } else {
    return true;
  }
}

module.exports = {
  authenticate: authenticate,
  isValid: isValid,
};
