const createError = require('http-errors');
const express = require('express');
const path = require('path');
const ms = require('ms');
const cookieParser = require('cookie-parser');

const debug = require('debug')('nofise:server');

const indexRouter = require('./routes/index');

const app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);


// serve our static files via express. WARNING: Works in development environment only. Use proxies like NGINX in production!
if (process.env.NODE_ENV !== 'production') {
  debug(`Using directory "${process.env.FILEROOT}" to serve files`);
  app.use(express.static(process.env.FILEROOT,
      { etag: false, fallthrough: true, immutable: true, index: false, maxAge: ms('30 days') }));
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
