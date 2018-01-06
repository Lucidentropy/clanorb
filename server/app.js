let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let bodyParser = require('body-parser');
let routes = require('./router');
let app = express();

// view engine setup
app.set('views', path.join(__dirname, '../', 'app/views'));
app.set('view engine', 'pug');

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../', 'www')));

// Middleware security headers
app.use((req, res, next) => {
  res.header("X-Frame-Options", 'DENY');
  res.header("X-XSS-Protection", '1; mode=block');
  res.header("Cache-Control", 'public, max-age=30672000');
  res.header("Strict-Transport-Security", 'max-age=86400');
  res.header("X-Content-Type-Options", 'nosniff');

  // no cors for now
  // res.header("Access-Control-Allow-Origin", "*");
  // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("X-Zibit", 'yo dawg, I heard you like headers');
  res.header("X-Powered-By", 'Pessimism and Syntax Errors');
  next();
});

app.use('/', routes);

// 404 error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
if (app.get('env') === 'development') {
    app.locals.pretty = true;
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            environment : app.get('env'),
            message: err.message,
            code : err.status,
            error: err
        });
    });
}

// production error handler, no stacktraces
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        environment : app.get('env'),
        message: err.message,
        code : err.status,
        error: {}
    });
});


module.exports = app;