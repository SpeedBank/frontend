const axios = require('axios');
const speedBankGraphUrl = require('../config/external-services').speedBankGraphUrl;
const q = require('q');

function customerReviewService(req) {
  const deferred = q.defer();
  const mutationQuery = `mutation {
    createCustomerServiceReview(input:{
        data: {
          customerServiceId: 1,
          message: "${req.body.comments}",
          star: "${req.body.star}",
        }
      }){
        customerServiceReview{
          id,
          star
        }
      }
  }`
  const query = `${speedBankGraphUrl}${decodeURIComponent(mutationQuery)}`;
  axios.post(query, {}).then((res) => {
    deferred.resolve(res);
  }).catch((err) => {
    deferred.resolve(err);
  });
  return deferred.promise;
}

module.exports = {
  create: customerReviewService
}
