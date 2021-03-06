const _ = require('lodash');
const config = require('./../config');
const mongoose = require('mongoose');
const db = require('./../db');

/**
 * Seeds
 * 
 * Every seed has to export a generate method which will be responsable of
 * seeding the database. That method has to return a promise
 */
const seeds = [
  require('./users'),
  require('./posts')
];

/**
 * @author Daniel Jimenez <jimenezdaniel87@gmail.com>
 * @function prompt
 * @param {String} question Questrion that will prompt
 * @param {Function} callback Action to be done when user answer the question
 * @description Ask user a question
 */
function prompt(question, callback) {
  let stdin = process.stdin;
  let stdout = process.stdout;

  stdin.resume();
  stdout.write(question);

  stdin.once('data', function (data) {
    callback(data.toString().trim());
  });
}

/**
 * @author Daniel Jimenez <jimenezdaniel87@gmail.com>
 * @function deleteDatabaseQuestion
 * @description Ask user about deleting database before seeding it
 */
function deleteDatabaseQuestion() {
  prompt('Do you want to empty the current database Y/N? ', function(input) {
    if (input.toLowerCase() === 'y' || input.toLowerCase() === 'yes') {
      // Drop the database
      db.drop();
    }

    // Seed database
    seed(seeds);
  })
}

/**
 * @author Daniel Jimenez <jimenezdaniel87@gmail.com>
 * @function seed
 * @param {Array} seeds Collection of functions which will seed the database
 * @description Populate the database with the different seeds
 */
function seed(seeds) {
  var verbosity = true;
  db.seed(seeds, verbosity)
    .then(results => {
      console.log('\nSeeding finished.')
      process.exit();
    })
    .catch(error => console.error(error));
}

/**
 * @author Daniel Jimenez <jimenezdaniel87@gmail.com>
 * @function init
 * @description Init seeding process
 */
function init() {
  // Connect to db
  db.connect().then(deleteDatabaseQuestion);
}

// Init seeding process
init();



