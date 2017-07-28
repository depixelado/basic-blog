// Required packages
const mongoose = require('mongoose');
const config = require('./config');
var app = require('./appBootstrap');

// Datbase connection
mongoose.Promise = global.Promise; // Use default promises on mongoose

// Connect to db
var onDbConnected = mongoose.connect(
  'mongodb://' + config.db.host + '/' + config.db.name, 
  { useMongoClient: true }
);

onDbConnected.then(initServer);

/**
 * @function initServer
 * @author Daniel Jimenez <jimenezdaniel87@gmail.com>
 * @description Init the server when the database connection was succesfull
 */
function initServer () {
  console.log('Db connection was succesful.');

  // Start server
  app.listen(config.app.port);
  
  console.log('Server listenging on: ' + config.app.port);
}