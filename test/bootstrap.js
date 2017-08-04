const config = require('./../config');
const mongoose = require('mongoose');

// Global variables
__root = __dirname + '/../';
db = require(__root + 'db');
app = require('./../appBootstrap');

// Datbase connection
mongoose.Promise = global.Promise; // Use default promises on mongoose

// Connect to db
mongoose.connect(
  'mongodb://' + config.test.db.host + '/' + config.test.db.name, 
  { useMongoClient: true }
);

// Give objects testing functionality (https://www.npmjs.com/package/should)
require('should');

// Load utility functions to make easy testing
require('./utils');