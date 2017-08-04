const _ = require('lodash');
const faker = require('faker');
const Post = require('../models/Post');
const utils = require('../utils.js');

// CONFIG
const NUM_OF_POSTS = 50;
const MIN_TAGS_PER_POST = 1;
const MAX_TAGS_PER_POST = 5;

/**
 * @author Daniel Jimenez <jimenezdaniel87@gmail.com>
 * @function generateTags
 * @private 
 * @param {Number} min Minimum amount of generated tags
 * @param {Number} max Max amount of generated tags
 * @description Generate random tags
 */
function generateTags(min, max) {
  let tags = [];
  let tagsQuantity = Math.floor(Math.random() * (max-min)) + min;

  for(let i = min; i <= tagsQuantity; i++) {
    tags.push(faker.lorem.word());
  }

  return tags;
}

/**
 * @author Daniel Jimenez <jimenezdaniel87@gmail.com>
 * @function generatePosts
 * @private 
 * @param {Number} quantity Amount of posts to be generated
 * @description Generate a collection of random posts
 */
function generatePosts(quantity) {
  let posts = [];
  for(let i = 0; i < quantity; i++) {
    let title = faker.lorem.sentences(1);
    let tags =  generateTags(MIN_TAGS_PER_POST, MAX_TAGS_PER_POST);

    posts.push(new Post({
      title: title,
      slug: _.kebabCase(title),
      body: faker.lorem.paragraphs(2),
      tags: tags
    }));
  }

  return posts;
}

/**
 * @author Daniel Jimenez <jimenezdaniel87@gmail.com>
 * @function seed
 * @public 
 * @return {Promise} Resolved when posts are introduced on the db
 * @description Save into the database a collection of random posts 
 */
const seed = function seed() {
  return new Promise(function (resolve, reject) {
      // Save all posts and get a Promise array
      let savePosts = generatePosts(NUM_OF_POSTS)
        .map(post => {
          return new Promise(function (resolve, reject) {
            // Post saved one by one to execute 
            // PostSchema pre hook to hass password
            post.save()
              .then(resolve)
              .catch(reject)
          });
        });
      
      // Resolve promise when all posts are saved
      Promise.all(savePosts)
        .then((posts) => {
          resolve({
            name: 'posts',
            items: posts
          })
        })
        .catch(reject);
  });
}

module.exports = seed;