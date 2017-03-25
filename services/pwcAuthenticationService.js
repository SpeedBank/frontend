var axios = require('axios');
var querystring = require('querystring');

var pwcCredentials = require('../config/pwcCredentials');
var config = require('../config/headerConfig').header;

const { clientId, clientSecret } = pwcCredentials.pwcCredentials;

function authenticate() {
  var data = {
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'client_credentials',
  };
  config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
  axios.post('https://pwcstaging.herokuapp.com/oauth/token', querystring.stringify(data), config)
    .then((response) => {
        if (response.status == 200) {
          const result = Object.assign({}, response.data);
          expireTime = getExpireTime(response.data.expires_in);
          result.expireTime = expireTime;
          console.log(result);
          return result;
        }
      })
      .catch((error) => {
        console.error(error);
      })
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
  authenticate,
  isValid,
};
