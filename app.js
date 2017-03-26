var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var authenticationService = require('./services/authentication_service');
var q = require('q');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/home', (req, res) => {
  authenticationService.pwcAuthenticate(req, res).then((status) => {
    if (status === 'success') {
      res.render('home', { title: 'Home' });
    } else if (status === 'unauthenticated') {
      res.send('Not authenticated');
    } else {
      res.render('error', { title: 'Error' });
    }
  });
});

app.get('/', (req, res) => {
  res.render('index', { title: 'Login Page' });
});

app.get('/location', (req, res) => {
  res.render('map', { title: 'Location Page' });
});

app.get('/request', (req, res) => {
  res.render('request', { title: 'Request Page' });
});

app.get('/account', (req, res) => {
  res.render('account', { title: 'Create Account' });
});

app.get('/inquiries', (req, res) => {
  res.render('inquiries', { title: 'Your Enquiries' });
});

app.get('/review', (req, res) => {
  res.render('review', { title: 'Review Page' });
});

app.get('/login', (req, res) => {
  res.render('index', { title: 'Login Page' });
});

app.post('/login', urlencodedParser, (req, res) => {
  let deferred = q.defer();
  authenticationService.login(req)
    .then((userInfo) => {
      if (userInfo === 'loggedIn') {
        return authenticationService.pwcAuthenticate(req, res);
      } else if (userInfo && userInfo.data && userInfo.data.message === 'Invalid Credentials.'){
        res.send('Failure');
        deferred.reject('Failure');
        return deferred.promise;
      }
      return authenticationService.pwcAuthenticate(req, res);
    }).then(function (status) {
      if (status === 'success') {
        res.send('Succesful');
      } else {
        res.send('Failure to authenticate with PaywithCapture at the moment');
      }
    })
    .catch((err) => {
      console.log('error', err);
      if (err.message === 'Request failed with status code 401'){
        res.send('Error in credentials');
      }
    });
});
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
