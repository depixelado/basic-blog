const _ = require('lodash');
const utils = require('./../utils');
const Post = require('./../models/Post');
require('mongoose-pagination');

/**
 * @author Daniel Jimenez <jimenezdaniel87@gmail.com>
 * @function store
 * @param {Object} req HTTP request object
 * @param {Object} res HTTP response object
 * @description Store a post into the database with the data received from the request
 */
exports.store = function store(req, res) {
  // Create a new Post instance with the value to be stored
  const post = new Post({
    title: req.body.title,
    slug: _.kebabCase(req.body.title), // Generate slug from title
    body: req.body.body,
    tags: utils.string2TagsArray(req.body.tags), // Convert tags string on an array
    createdAt: new Date(), // Generate dates
    updatedAt: new Date()
  });

  post.save()
    .then((doc) => res.json(post))
    .catch(err => {
      res
        .status(400)
        .json({ message: err });
    });
}

/**
 * @author Daniel Jimenez <jimenezdaniel87@gmail.com>
 * @function list
 * @param {Object} req HTTP request object
 * @param {Object} res HTTP response object
 * @description Show all posts on the database
 */
exports.list = function list(req, res) {
  Post.find()
    .paginate(req.query.page, req.query.limit)
    .exec()
    .then(posts => res.json(posts))
    .catch(err => {
      res
        .status(400)
        .json({ message: err });
    });
}

/**
 * @author Daniel Jimenez <jimenezdaniel87@gmail.com>
 * @function show
 * @param {Object} req HTTP request object
 * @param {Object} res HTTP response object
 * @description Show a post by its id sent as a request param
 */
exports.show = function show(req, res) {
  Post.findById(req.params.postId).exec()
    .then(post => res.json(post))
    .catch((err) => {
      res
        .status(404)
        .json({ message: err });
    });
}

/**
 * @author Daniel Jimenez <jimenezdaniel87@gmail.com>
 * @function update
 * @param {Object} req HTTP request object
 * @param {Object} res HTTP response object
 * @description Update a post by its id sent as a request param
 */
exports.update = function updatePost(req, res) {
  Post.findById(req.params.postId).exec()
    .then(post => {
      post.title = req.body.title
      post.slug = utils.slugify(req.body.title);
      post.body = req.body.body
      post.tags = utils.string2TagsArray(req.body.tags);

      return post.save()
    })
    .then(post => res.json(post))
    .catch(error => {
      res
        .status(404)
        .json({ message: err });
    });
}

/**
 * @author Daniel Jimenez <jimenezdaniel87@gmail.com>
 * @function remove
 * @param {Object} req HTTP request object
 * @param {Object} res HTTP response object
 * @description Remove a post by its id sent as a request param
 */
exports.remove = function remove(req, res) {
  const queryObject = {
    _id: req.params.postId
  };

  Post.remove(queryObject)
    .then(() => res.json({ message: 'Successfully deleted' }))
    .catch(error => {
      res
        .status(400)
        .json({ message: 'Error: Unable to delete the resource' });
    });
}