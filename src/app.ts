import bodyParser from 'body-parser';
import express from 'express';
import hbs from 'hbs';
import logger from 'morgan';
import path from 'path';
import favicon from 'serve-favicon';
import { justNames } from './models/district';
import { indexRouter } from './routes/index';

const app = express();

hbs.registerPartials(__dirname + '/views/partials', () => {
  console.log('Handlebars Partials Loaded!');
});
hbs.localsAsTemplateData(app);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//Set up list of districts for nav menu on every page with startup query
justNames().then(data => {
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
app.use(express.static(path.join(__dirname, 'public')));

app.get('/profile', isLoggedIn, function(req, res, _next) {
  res.render('profile', {
    user: JSON.stringify(req.user),
  });
});

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(_req, _res, next) {
  const err = new Error('Not Found');
  (err as any).status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, _next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;

function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated()) return next();

  // if they aren't redirect them to the home page
  req.flash('info', "Can't access. Not logged in!");
  res.redirect('/login');
}
