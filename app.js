var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var authenticationService = require('./services/authentication_service');

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
  authenticationService(req, res).then((status) => {
    if (status === 'success') {
      res.render('home', { title: 'Home' });
    } else if (status === 'unauthenticated') {
      res.redirect('/');
    } else {
      res.render('error', { title: 'Error' });
    }
  });
});

app.get('/',(req, res) => {
  res.render('index', { title: 'Login Page' });
});

app.get('/location',(req, res) => {
  res.render('location', { title: 'Location Page' });
});

app.get('/review',(req, res) => {
  res.render('review', { title: 'Review Page' });
});

app.post('/login', urlencodedParser, (req, res) => {
  const response = {
      email: req.body.email,
      password: req.body.password
  };
  console.log(response);
  res.end(JSON.stringify(response));
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
