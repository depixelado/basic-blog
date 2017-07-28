const faker = require('faker');
const User = require('../models/User');
const utils = require('../utils.js');

// CONFIG
const NUM_OF_USERS = 20;

/**
 * @author Daniel Jimenez <jimenezdaniel87@gmail.com>
 * @function generateUsers
 * @private 
 * @param {Number} quantity Amount of users to be generated
 * @description Generate a collection of random users
 */
function generateUsers(quantity) {
  let users = [];

  users.push(new User({
    username: 'admin',
    password: 'admin'
  }));

  for(let i = 0; i < quantity; i++) {
    users.push(
      new User({
        username: faker.internet.userName(),
        password: '123456'
      })
    );
  }

  return users;
}

/**
 * @author Daniel Jimenez <jimenezdaniel87@gmail.com>
 * @function generate
 * @public 
 * @return {Promise} Resolved when users are introduced on the db
 * @description Save into the database a collection of random users 
 */
const generate = function generate() {
  return new Promise(function (resolve, reject) {
      // Save all users and get a Promise array
      let saveUsers = generateUsers(NUM_OF_USERS)
        .map(user => {
          return new Promise(function (resolve, reject) {
            // User saved one by one to execute 
            // UserSchema pre hook to hass password
            user.save()
              .then(resolve)
              .catch(reject)
          });
        });
      
      // Resolve promise when all users are saved
      Promise.all(saveUsers)
        .then((result) => {
          console.log(' - ' + NUM_OF_USERS + ' users generated.');
          resolve()
        })
        .catch(reject);
  });
}

module.exports = generate;