const mongoose = require('mongoose');
const config = require('./../config');

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
      mongoose.connection.db.dropDatabase();
    }

    // Seed database
    seed();
  })
}

/**
 * @author Daniel Jimenez <jimenezdaniel87@gmail.com>
 * @function seed
 * @description Populate the database with the different seeds
 */
function seed() {
  console.log('\nSeeding the database...\n');
  var seedPromises = seeds.map(seed => seed());

  var seedsIterator = seeds[Symbol.iterator]();

  

  Promise.all(seedPromises)
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
  mongoose.Promise = global.Promise; // Use default promises on mongoose

  var onDbConnected = mongoose.connect(
    'mongodb://' + config.db.host + '/' + config.db.name, 
    { useMongoClient: true }
  );

  // Seed datbase once db connection is established
  onDbConnected.then(deleteDatabaseQuestion);
}

// Init seeding process
init();



