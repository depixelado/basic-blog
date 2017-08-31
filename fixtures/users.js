const faker = require('faker');
const User = require('../models/User');
const utils = require('../utils.js');
const fs = require('fs');

const config = require('../config.js');

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
    password: 'admin',
    description: faker.lorem.paragraphs(2),
    email: faker.internet.email(),
    avatar: generateAvatar('admin')
  }));

  for(let i = 0; i < quantity; i++) {
    const username = faker.internet.userName();
    const avatarAbsoluteUrl = 

    users.push(
      new User({
        username,
        password: '123456',
        description: faker.lorem.paragraphs(2),
        email: faker.internet.email(),
        avatar: generateAvatar(username),
      })
    );
  }

  return users;
}

function generateAvatar(userId) {
  const randomNumber = Math.floor(Math.random() * 5 + 1);
  const avatarName = `avatar${randomNumber}.jpg`;
  const avatarPath = `fixtures/assets/img/profiles/${avatarName}`;
  const newAvatarName = `${userId}.jpg`;

  fs.createReadStream(avatarPath)
    .pipe(fs.createWriteStream(`public/avatars/${newAvatarName}`));
  
  return newAvatarName;
}

/**
 * @author Daniel Jimenez <jimenezdaniel87@gmail.com>
 * @function seed
 * @public 
 * @return {Promise} Resolved when users are introduced on the db
 * @description Save into the database a collection of random users 
 */
const seed = function seed() {
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
        .then((users) => {
          resolve({
            name: 'users',
            items: users
          })
        })
        .catch(reject);
  });
}

module.exports = seed;