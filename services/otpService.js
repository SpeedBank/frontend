const axios = require('axios');

const config = require('../config/headerConfig').header;


function requestSmsOtp(token) {
  config.headers.Authorization = `Bearer ${token}`;
  axios.get('https://pwcstaging.herokuapp.com/otp/sms/+2347031667744', config)
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.error(error);
    });
}

module.exports = {
  requestSmsOtp,
};

