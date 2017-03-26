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

app.use(function (req, res, next) {
  // Redirect Home if already logged in
  req.authenticated = true;
  if (!req.cookies.userInfo) {
    req.authenticated = false;
  } else if (req.originalUrl === '/login' && req.cookies.userInfo) {
    res.redirect('/home');
  }
  next();
});

app.get('/home', (req, res) => {
  if (req.authenticated) {
    return res.render('home', { title: 'Home' });
  }
  res.render('index', { title: 'Login Page', view: 'Login', alert: null });
});

app.get('/', (req, res) => {
  res.render('index', { title: 'Login Page', view: 'Login', alert: null });
});

app.get('/location', (req, res) => {
  if (req.authenticated) {
    return res.render('location', { title: 'Location Page' });
  }
  res.render('index', { title: 'Login Page', view: 'Login', alert: null });
});

app.get('/request', (req, res) => {
  if (req.authenticated) {
    res.render('request', { title: 'Request Page' });
  }
  res.render('index', { title: 'Login Page', view: 'Login', alert: null });
});

app.get('/account', (req, res) => {
  if (req.authenticated) {
    authenticationService.pwcAuthenticate(req, res).then((status) => {
      if (status === 'success') {
        return res.redirect('/account');
      } else {
        return res.render('account', { title: 'Account', alert: { message: 'An Error occured, please try again later' } });
      }
    });
    return res.render('account', { title: 'Create Account' });
  }
  res.render('index', { title: 'Login Page', view: 'Login', alert: null });
});

app.get('/inquiries', (req, res) => {
  res.render('inquiries', { title: 'Your Enquiries' });
});

app.get('/review', (req, res) => {
  res.render('review', { title: 'Review Page' });
});

app.get('/login', (req, res) => {
  res.render('index', { title: 'Login Page', view: 'Login', alert: null });
});

app.get('/signup', (req, res) => {
  res.render('index', { title: 'SignUp Page', view: 'SignUp', alert: null });
});

app.post('/login', urlencodedParser, (req, res) => {
  authenticationService.login(req)
    .then((userInfo) => {
      if (userInfo === 'loggedIn') {
        res.redirect('/home');
      } else if (userInfo && userInfo.data) {
        res.cookie('userInfo', JSON.stringify(userInfo.data));
        res.redirect('/home');
      }
    }).catch((err) => {
      if (err.message === 'Request failed with status code 401'){
        res.send('Error in credentials');
      }
    });
});

app.get('/new_account', (req, res) => {
  if (!authenticationService.isLoggedIn(req)) {
    res.render('index', { title: 'SignIn Page', view: 'SignIn', alert: null });
  }
  authenticationService.pwcAuthenticate(req, res).then((status) => {
    if (status === 'success') {
      res.render('account');
    } else {
      res.render('account', { title: 'New Bank Account', alert: { message: 'An Error occured, please try again later' } });
    }
  }).catch((err) => {
    res.render('account', err)
  })
});


app.post('/signup', urlencodedParser, (req, res) => {
  authenticationService.signUp(req)
    .then((signUpResponse) => {
      console.log('Sign Up details', signUpResponse.data.data.createUser.user);
      if (signUpResponse.data.data.createUser.user) {
        res.cookie('userInfo', signUpResponse.data.data.createUser.user);
        res.render('home', { title: 'Home Page', alert: 'SignUp Succesful' });
      } else {
        var templateObject = { title: 'Sign Up Page', error: 'Please enter your details correctly', view: 'SignUp', alert: { message: 'Please Supply Valid Information' } };
        res.render('index', templateObject);
      }
    }).catch((err) => {
      console.log('Error', err)
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
