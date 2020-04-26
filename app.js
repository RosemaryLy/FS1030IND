const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const flash = require('express-flash');
const session = require('express-session');
const mysql = require('mysql');
const connection  = require('./config/db');

const indexRouter = require('./routes/index');
const dashboardRouter = require('./routes/dashboard');
const usersRouter = require('./routes/users');
const portfoliosRouter = require('./routes/portfolios');
const resumeRouter= require ('./routes/resume');
const contactlistingRouter= require('./routes/contactlisting');

const app = express();
const port = 5000;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('port', process.env.port || port);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ 
    cookie: { maxAge: 60000 },
    store: new session.MemoryStore,
    saveUninitialized: true,
    resave: 'true',
    secret: 'secret'
}))

app.use(flash());

app.use('/', indexRouter);
app.use('/dashboard', dashboardRouter);
app.use('/users', usersRouter);
app.use('/portfolios', portfoliosRouter);
app.use('/resume', resumeRouter);
app.use('/contactlisting', contactlistingRouter);

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

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});

module.exports = app;