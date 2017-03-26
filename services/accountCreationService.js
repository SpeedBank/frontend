const axios = require('axios');
const querystring = require('querystring');

const config = require('../config/headerConfig').header;

const token = '931fae7cdf597f8f90f07c9b26d8e76ce67631d8';
const data = {
  email: 'xyz@yahoo.com',
  bvn: '12345678901',
  gender: 'M',
  address1: '12 Sabo Street',
  address2: 'Yaba',
  dateofbirth: '1990-02-13',
  state: 'Lagos',
  religion: 'CHRISTIANITY',
  branchcode: '101',
  photo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEMgAAADICAMAAACahl==',
  signature: 'data:image/png;base64,iVBORw0KGgoASUhEMgAAADICAMAAACahl==',
  validid: 'data:image/png;base64,iVBORKGgoAAAANSUhEMgAAADICAMAAACahl=='
};

function updateAdminPartial(localData) {
  return 101;
}

function updateAdminFull(localData) {
  return;
}

// function createBankAccount(token, data) {
function createBankAccount(token, data) {
  config.headers.Authorization = `Bearer ${token}`;
  axios.post('https://pwcstaging.herokuapp.com/user/requestBankAccount', JSON.stringify(data), config)
    .then(response => {
      const result = Object.assign({}, response.data);
      if (response.data.status === 'success') {
        if (response.data.data.responseCode === '00') {
          updateAdminFull(data);
        } else if (response.data.data.responseCode === '02') {
          const accountId = updateAdminPartial(data);
          result.accountId = accountId;
        }
      }
      console.log(response);
      console.log(result);
      return result;
    })
    .catch((error) => {
      console.error(error);
    });
}

function validateAccountOpening(localData) {
  config.headers.Authorization = `Bearer ${token}`;
  axios.post('https://pwcstaging.herokuapp.com/user/validateAccountRequest', JSON.stringify(localData), config)
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.error(error);
    });
}

module.exports = {
  createBankAccount,
  validateAccountOpening,
};
