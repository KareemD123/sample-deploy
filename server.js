var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session')
const methodOverride = require('method-override')
const passport = require('passport')
// Don't forget to rename the indexRouter to movieRouter on line 24 as well
var movieRouter = require('./routes/movies');
var usersRouter = require('./routes/users');

const { connectToDatabase } = require('./config/database')

var app = express();
// Load environment variables
require('dotenv').config()
connectToDatabase()
require('./config/passport')
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use(
  session({
    secret: "SEIRocks!", // The secret can be anything
    resave: false,
    saveUninitialized: true
  })
  )
  
  app.use(passport.initialize())
  app.use(passport.session())
  
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(methodOverride('_method'))
  
  // Optional 
//   const User = require('./models/User')
//   app.use(async function (req, res, next) {
//   const user = await User.findOne({ firstName: 'Test' })
//   req.user = user
//   next()
// })


// Routes
app.use('/', movieRouter);
app.use('/', usersRouter);

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
