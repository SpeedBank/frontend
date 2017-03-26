const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const authenticationService = require('./services/authentication_service');
const q = require('q');
const accountCreationService = require('./services/accountCreationService');
const customerServiceReview = require('./services/customerServiceReview');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
  // Redirect Home if already logged in
  req.authenticated = true;
  if (!req.cookies.userInfo) {
    req.authenticated = false;
    if (req.originalUrl !== '/' && req.method == 'GET') {
      res.redirect('/');
    }
  }
  next();
});

app.get('/', (req, res) => {
  if (req.authenticated) {
    return res.render('dashboard', { title: 'Dashboard', view: 'Dashboard', alert: null, user: {} });
  }
  res.render('index', { title: 'Login Page', view: 'Login', alert: null, user: {} });
});

app.get('/location', (req, res) => {
  if (req.cookies.userInfo) {
    return res.render('location', { title: 'Location Page', user: { email: 'dsds@yahoo.com', name: 'Charles', user_id: 1 }, view: 'Location' });
  }
  res.render('index', { title: 'Login Page', view: 'Login', alert: null });
});

app.get('/inquiries', (req, res) => {
  if (req.cookies.userInfo) {
    return res.render('inquiries', { title: 'Inquiries Page', user: { email: 'dsds@yahoo.com', name: 'Charles', user_id: 1 }, view: 'Inquiries' });
  }
  res.render('index', { title: 'Login Page', view: 'Login', alert: null });
});

app.get('/request', (req, res) => {
  if (req.cookies.userInfo) {
    res.render('request', { title: 'Request Page', alert: null, view: 'Request', user: { email: 'dsds@yahoo.com', name: 'Charles', user_id: 1 } });
  }
  res.render('index', { title: 'Login Page', view: 'Login', alert: null, user: { email: 'dsds@yahoo.com', name: 'Charles', user_id: 1 } });
});

app.get('/accountsummary', (req, res) => {
  if (req.cookies.userInfo) {
    res.render('accountSummary', { title: 'Account Summary Page', alert: null, view: 'AccountSummary', user: { email: 'dsds@yahoo.com', name: 'Charles', user_id: 1 } });
  }
  res.render('index', { title: 'Login Page', view: 'Login', alert: null, user: { email: 'dsds@yahoo.com', name: 'Charles', user_id: 1 } });
});

app.get('/account', (req, res) => {
  if (!req.cookies.userInfo) {
    return res.render('index', { title: 'Login Page', view: 'Login', alert: null, user: { email: 'dsds@yahoo.com', name: 'Charles', user_id: 1 } });
  }
  res.render('account', { title: 'Account Page', alert: null, user: { email: 'dsds@yahoo.com', name: 'Charles', user_id: 1 }, view: 'Account' });
});

app.post('/review', urlencodedParser, (req, res) => {
  customerServiceReview.create(req).then(() => {
    res.render('review', { title: 'Customer Service Review', alert: { message: 'Your review was retrieved succesfully' }, user: { email: 'dsds@yahoo.com', name: 'Charles', user_id: 1 }, view: 'Review' });
  }).catch(() =>{
    res.render('review', { title: 'Customer Service Review', alert: { message: 'Your review was retrieved succesfully' }, user: { email: 'dsds@yahoo.com', name: 'Charles', user_id: 1 }, view: 'Review' });
  });
});

app.get('/review', (req, res) => {
  if (!req.authenticated) {
    return res.render('index', { title: 'Login Page', view: 'Login', alert: null, user: { email: 'dsds@yahoo.com', name: 'Charles', user_id: 1 } });
  }
  res.render('review', { title: 'Review Page', user: {}, alert: null, view: 'Review' });
});

app.get('/logout', (req, res) => {
    res.clearCookie('userInfo');
    res.redirect('/');
});

app.get('/signup', (req, res) => {
  res.render('index', { title: 'SignUp Page', view: 'SignUp', alert: null });
});

app.post('/login', urlencodedParser, (req, res) => {
  authenticationService.login(req)
    .then((userInfo) => {
      if (userInfo === 'loggedIn') {
        res.redirect('/');
      } else if (userInfo && userInfo.data) {
        res.cookie('userInfo', JSON.stringify(userInfo.data));
        res.redirect('/');
      }
    }).catch((err) => {
      if (err.message === 'Request failed with status code 401'){
        res.send('Error in credentials');
      }
    });
});

app.post('/account', (req, res) => {
  if (!req.cookies.userInfo) {
    return res.render('index', { title: 'SignIn Page', view: 'SignIn', alert: null });
  }
  const payload = {
    email: req.body.email,
    bvn: req.body.bvn,
    gender: req.body.gender,
    address1: req.body.address1,
    address2: req.body.address2,
    dateofbirth: req.body
  };
  authenticationService.pwcAuthenticate(req, res).then((status) => {
    accountCreationService.createBankAccount(payload).then((res) => {

    });
  });
});

app.get('/new_account', (req, res) => {
  if (!req.cookies.userInfo) {
    return res.render('index', { title: 'SignIn Page', view: 'SignIn', alert: null, user: {} });
  }
  authenticationService.pwcAuthenticate(req, res).then((status) => {
    if (status === 'success') {
      res.render('account', { title: 'New Bank Account', alert: null, user: { }, view: 'Account' });
    } else {
      res.render('account', { title: 'New Bank Account', alert: { message: 'An Error occured, please try again later' }, view: 'Account' });
    }
  }).catch((err) => {
    console.log(err);
  });
});


app.post('/signup', urlencodedParser, (req, res) => {
  authenticationService.signUp(req)
    .then((signUpResponse) => {
      console.log('Sign Up details', signUpResponse.data.data.createUser.user);
      if (signUpResponse.data.data.createUser.user) {
        res.cookie('userInfo', signUpResponse.data.data.createUser.user);
        res.render('dashboard', { title: 'Home Page', alert: 'SignUp Succesful', view: 'Home', user: {} });
      } else {
        const templateObject = { title: 'Sign Up Page', error: 'Please enter your details correctly', view: 'SignUp', alert: { message: 'Please Supply Valid Information' } };
        res.render('index', templateObject);
      }
    }).catch((err) => {
      console.log('Error', err);
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
