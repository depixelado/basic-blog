const mongoose = require('mongoose');
const async = require('async');
const config = require('./config');

exports.MODE_TEST = 'mode_test';
exports.MODE_PRODUCTION = 'mode_production';

const PRODUCTION_URI = 'mongodb://' + config.db.host + '/' + config.db.name;
const TEST_URI = 'mongodb://' + config.test.db.host + '/' + config.test.db.name;

// Set mongoose promise system
mongoose.Promise = global.Promise; // Use default promises on mongoose

// DB connection state
let state = {
  db: null,
  mode: null,
}

/**
 * @author Daniel Jimenez <jimenezdaniel87@gmail.com>
 * @function connect
 * @public 
 * @param {String} mode Execution mode (test and production)
 * @param {Function} done Executed either the connection was successfull or not
 * @return {Promise} To be fulfill when the DB connection is stablished
 * @description Connect to the DB
 */
exports.connect = function connect(mode, done) {
  // Gard. Returned a fullfilled promise 
  // if (state.db) return Promise.fulfill(state.db);

  // Get uri based on the mode
  let uri = (mode === exports.MODE_TEST) ? TEST_URI : PRODUCTION_URI;
  let onConnection = mongoose.connect(
    'mongodb://' + config.db.host + '/' + config.db.name, 
    { useMongoClient: true }
  );

  return onConnection
    .then(db => {
      state.db = mongoose.connection.db;
      state.mode = mode;

      return mongoose.connection.db;
    });
};

/**
 * @author Daniel Jimenez <jimenezdaniel87@gmail.com>
 * @function getDB
 * @public 
 * @description Retrieve db connection
 */
exports.getDB = function getDB() {
  return state.db;
};

/**
 * @author Daniel Jimenez <jimenezdaniel87@gmail.com>
 * @function drop
 * @public 
 * @param {Function} done Callback function to be called after finishing
 * @description Drop the DB
 */
exports.drop = function() {
  if (!state.db) return Promise.reject(new Error('No database connection'));

  return new Promise((resolve, reject) => {
    state.db.dropDatabase((error) => {
      if (error) return reject(error);

      return resolve();
    });
  });
};

/**
 * @author Daniel Jimenez <jimenezdaniel87@gmail.com>
 * @private
 * @function createCollection
 * @param {String} name Collection's name to be created
 * @return {Promise}
 * @description Creates a new collection
 */
const createCollection = function createCollection(name) {
  return new Promise((resolve, reject) => {
    state.db.createCollection(name, function(err, collection) {
      if (err) return reject(err);

      return resolve(collection);
    })
  });
};

/**
 * @author Daniel Jimenez <jimenezdaniel87@gmail.com>
 * @private
 * @function seedCollection
 * @param {Object} data to be seeded
 * @param {String} name Collection name
 * @return {Promise}
 */
const seedCollection = function seedCollection(data, name) {
  return new Promise((resolve, reject) => {
    state.db.collection(name).insert(data[name], (error, result) => {
      if(error) return Promise.reject(error);
      return resolve(result);
    })
  });
};

/**
 * @author Daniel Jimenez <jimenezdaniel87@gmail.com>
 * @function seed
 * @param {Array} seeds Seeds collection
 * @param {Boolean} verbose Display process status on console log when TRUE
 * @description Populate the database with the different seeds
 */
exports.seed = function seed(seeds, verbose = false) {
  return seeds.reduce( 
    (acc, seed) => acc.then((result) => {
      return seed()
        .then((results) => {
          if (verbose) console.info(` - ${results.items.length} ${results.name} generated.`)
          return Promise.resolve(results);
        })
        .catch((error) => Promise.reject(error));
    }), 
    Promise.resolve()
  );
}

exports.close = function close() {
  mongoose.connection.close();
}