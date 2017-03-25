const axios = require('axios');
const uuidV4 = require('uuid/v4');

const config = require('../config/headerConfig').header;

const token = '931fae7cdf597f8f90f07c9b26d8e76ce67631d8';


function listBillers() {
  config.headers.Authorization = `Bearer ${token}`;
  axios.get('https://pwcstaging.herokuapp.com/user/billers', config)
    .then(response => {
      console.log(response.data);
      return response.data;
    })
    .catch(error => {
      console.error(error);
      return error;
    });
}

function listBillerProducts(id) {
  config.headers.Authorization = `Bearer ${token}`;
  axios.get(`https://pwcstaging.herokuapp.com/user/${id}/products`, config)
    .then(response => {
      console.log(response.data.data[0]);
      return response.data;
    })
    .catch(error => {
      console.error(error);
      return error;
    });
}

function sendMoneyToBiller(data) {
  config.headers.Authorization = `Bearer ${token}`;
  // config.headers['Content-Type'] = 'application/json';
  data.transaction_id = uuidV4();
  axios.post('https://pwcstaging.herokuapp.com/orders/makeBillPayment', JSON.stringify(data), config)
    .then(response => {
      console.log(response.data);
      return response.data;
    })
    .catch(error => {
      console.error(error.response.data);
      return error.response.data;
    });
}

// listBillers();
// listBillerProducts('571cb4f8e2f0cf11003d2214');
const gData = {
  product_id: '571f53530fb6a311003bc50f',
  hookdata: {
    amount: '10000',
    recipient_phone_number: '+2348037784194'
  },
  description: 'MTN Nigeria Mobile Top Up',
};

sendMoneyToBiller(gData);

module.exports = {
  listBillers,
  listBillerProducts,
};
