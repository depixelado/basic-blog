// Required packages
const bodyParser = require('body-parser');
const express = require('express');
const helmet = require('helmet');
const routes = require('./routes/routes');
var passport = require('passport');
const auth = require('./middlewares/auth');

// App config vars
var config = require('./config');

// Init express app
var app = express();

// Configure app to use body parser
app.use(helmet());

// Body parsers
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.all('*', auth.isAuthenticated);

// Use the passport package in our application
app.use(passport.initialize());

// Static
app.use(express.static('public'))

// Register routes
app.use('/api', routes);

module.exports = app;