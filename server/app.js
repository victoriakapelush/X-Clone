const createError = require('http-errors');
const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
require('dotenv').config({ path: './config.env' });
require('./config-passport');

const indexRouter = require('./routes/index');
const authRoutes = require('./routes/auth');
const homeRouter = require('./routes/home');

const app = express();
const mongoDB = process.env.mongoDB;

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}));

mongoose.set('strictQuery', false);

// Connect to MongoDB
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    const PORT = process.env.PORT || 8000
    app.listen(PORT, () => {
        console.log(`App is Listening on PORT ${PORT}`);
    })
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
  });

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client/dist')));
app.use(express.static(path.join(__dirname, 'public')));

// Add session middleware
app.use(session({
  secret: 'cats',
  resave: false,
  saveUninitialized: false
}));
  
// Initialize passport and session
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/', indexRouter);
app.use(authRoutes);
app.use('/home', homeRouter);

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
  res.json({ error: err.message });
});

module.exports = app;
