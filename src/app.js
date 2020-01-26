console.log('file:', __filename, 'cwd:', process.cwd());

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');

var mongoose = require('./db/mongoose-load').mongoose;
var User = require('./models/user');
var Garbage = require('./models/garbage');
var District = require('./models/district');

require('./config/passport')(passport);

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
var hbs = require('hbs'); //See info here: https://www.npmjs.com/package/hbs
hbs.registerPartials(__dirname + '/views/partials', () => {
  console.log('Handlebars Partials Loaded!');
});
hbs.localsAsTemplateData(app);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//Set up list of districts for nav menu on every page with startup query
District.find()
  .justNames()
  .exec()
  .then(data => {
    app.locals.navDistricts = data;
  });

//set page title/metadata for template
app.locals.title = 'Gomitrack';

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  //let us access locals object
  res.locals.userObject = req.user;
  next();
});
app.use(flash());

app.post(
  '/login',
  passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true,
  })
);

app.get('/login', function(req, res, next) {
  res.render('login', {
    message: JSON.stringify(req.flash()),
  });
});

app.post(
  '/signup',
  passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true,
  })
);

app.get('/signup', function(req, res, next) {
  res.render('signup', {
    message: JSON.stringify(req.flash()),
  });
});

app.get('/profile', isLoggedIn, function(req, res, next) {
  res.render('profile', {
    user: JSON.stringify(req.user),
  });
});

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated()) return next();

  // if they aren't redirect them to the home page
  req.flash('info', "Can't access. Not logged in!");
  res.redirect('/login');
}
