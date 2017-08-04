// Required packages
const config = require('./config');
const db = require('./db');
var app = require('./appBootstrap');

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

// Connect to DB
db.connect()
  .then(initServer);