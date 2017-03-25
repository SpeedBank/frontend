const payWithCaptureAuth = require('./pwcAuthenticationService');
const q = require('q');

function authenticationService(req, res){
  var deferred = q.defer();
  payWithCaptureAuth.authenticate().then((authResponse) => {
    res.cookie('tokesan', authResponse.data);
    deferred.resolve('success');
  }).catch((errResponse) => {
    deferred.reject('error');
  });
  return deferred.promise;
}

module.exports = authenticationService;
