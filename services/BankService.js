const axios = require('axios');
const querystring = require('querystring');
const uuidV4 = require('uuid/v4');

const config = require('../config/headerConfig').header;

const token = '931fae7cdf597f8f90f07c9b26d8e76ce67631d8';


function listBanks() {
  config.headers.Authorization = `Bearer ${token}`;
  axios.get('https://pwcstaging.herokuapp.com/banks', config)
    .then(response => {
      console.log(response.data);
      return response.data;
    })
    .catch(error => {
      console.error(error);
      return error;
    });
}

function getTransactionStatus(transactionId) {
  config.headers.Authorization = `Bearer ${token}`;
  axios.get(`https://pwcstaging.herokuapp.com/orders/transactions?transaction_id=${transactionId}`, config)
    .then(response => {
      console.log(response.data);
      return response.data;
    })
    .catch(error => {
      console.error(error);
      return error;
    });
}

function transferAccessToAccess(data) {
  config.headers.Authorization = `Bearer ${token}`;
  config.headers['Content-Type'] = 'application/json';
  data.Transaction_id = uuidV4();
  axios.post('https://pwcstaging.herokuapp.com/orders/makePayment', JSON.stringify(data), config)
    .then(response => {
      console.log(response.data);
      return response.data;
    })
    .catch(error => {
      console.error(error.response.data);
      return error.response.data;
    });
}

function transferAccessToOthers(data) {
  config.headers.Authorization = `Bearer ${token}`;
  config.headers['Content-Type'] = 'application/json';
  data.Transaction_id = uuidV4();
  axios.post('https://pwcstaging.herokuapp.com/orders/makePayment', JSON.stringify(data), config)
    .then(response => {
      console.log(response.data);
      return response.data;
    })
    .catch(error => {
      console.error(error.response.data);
      return error.response.data;
    });
}

const gData = {
  amount: '500',
  description: 'transfer to access 0690000012',
  type: 'transfer',
  transferType: 'AA',
  bankcode: '044',
  creditacctno: '0690000012'
};

const oData = {
  amount: '500',
  description: 'transfer to access 0690000012',
  type: 'transfer',
  transferType: 'AO',
  bankcode: '058',
  creditacctno: '0690000012',
};

// listBanks();
// transferAccessToAccess(gData);
// transferAccessToOthers(oData);
// getTransactionStatus('33194f1d-8bb9-4c10-9719-cab4cca768bd');

module.exports = {
  listBanks,
  transferAccessToAccess,
  transferAccessToOthers,
  getTransactionStatus,
};
