const _ = require('lodash');
const Comment = require('../models/Comment');
const db = require('../db');
const faker = require('faker');
const Post = require('../models/Post');
const utils = require('../utils.js');

// CONFIG
const NUM_OF_POSTS = 50;
const MIN_TAGS_PER_POST = 1;
const MAX_TAGS_PER_POST = 5;
const MIN_COMMENTS_PER_POST = 0;
const MAX_COMMENTS_PER_POST = 20;

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
 * @function generateComments
 * @private 
 * @param {Number} min Minimum amount of generated comments
 * @param {Number} max Max amount of generated comments
 * @description Generate random comments
 */
function generateComments(userIds, min, max) {
  let comments = [];
  let commentsQuantity = Math.floor(Math.random() * (max-min)) + min;
  let userId = userIds[Math.floor(Math.random() * userIds.length)];

  for(let i = min; i <= commentsQuantity; i++) {
    comments.push({
      body: faker.lorem.paragraphs(2),
      userId: userId
    });
  }

  return comments;
}

/**
 * @author Daniel Jimenez <jimenezdaniel87@gmail.com>
 * @function generatePosts
 * @private 
 * @param {Number} quantity Amount of posts to be generated
 * @description Generate a collection of random posts
 */
function generatePosts(quantity) {
  return db.pluck('users', '_id')
    .then((userIds) => {
      let posts = [];
      for(let i = 0; i < quantity; i++) {
        let title = faker.lorem.sentences(1);
        let tags =  generateTags(MIN_TAGS_PER_POST, MAX_TAGS_PER_POST);
        let userId = userIds[Math.floor(Math.random() * userIds.length)];
        let comments = generateComments(userIds, MIN_TAGS_PER_POST, MAX_TAGS_PER_POST);

        posts.push(new Post({
          title: title,
          slug: _.kebabCase(title),
          body: faker.lorem.paragraphs(2),
          tags: tags,
          userId: userId,
          comments: comments
        }));
      }

      return Promise.resolve(posts);
    });
};

/**
 * @author Daniel Jimenez <jimenezdaniel87@gmail.com>
 * @function seedPosts
 * @param {Array} posts Array of Post models
 * @return {Promise}
 * @description seed posts into the database
 */
const seedPosts = function seedPosts(posts) {
  // Save all posts and get a Promise array
  let savePosts = posts.map((post) => post.save());
  
  // Resolve promise when all posts are saved
  return Promise.all(savePosts)
    .then((posts) => {
      return Promise.resolve({
        name: 'posts',
        items: posts
      })
    });
}

/**
 * @author Daniel Jimenez <jimenezdaniel87@gmail.com>
 * @function seed
 * @public 
 * @return {Promise} Resolved when posts are introduced on the db
 * @description Save into the database a collection of random posts 
 */
const seed = function seed() {
  return generatePosts(NUM_OF_POSTS).then(seedPosts);
}

module.exports = seed;