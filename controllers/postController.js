require('mongoose-pagination');

const _ = require('lodash');
const HttpStatus = require('http-status-codes');
const mongoose = require('mongoose');
const Post = require('./../models/Post');
const utils = require('./../utils');

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
    tags: utils.string2TagsArray(req.body.tags), // Convert tags string on an array,
    userId: req.user._id,
  });

  post.save()
    .then(post => res.json(post))
    .catch(err => {
      res
        .status(HttpStatus.BAD_REQUEST)
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
        .status(HttpStatus.BAD_REQUEST)
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
        .status(HttpStatus.NOT_FOUND)
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
      post.title = req.body.title || post.title;
      post.slug = utils.slugify(req.body.title) || post.slug;
      post.body = req.body.body || post.body;
      post.tags = utils.string2TagsArray(req.body.tags) || post.tags;

      return post.save()
    })
    .then(post => res.json(post))
    .catch(error => {
      res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: error });
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
    .then(() => {
      res
        .status(HttpStatus.NO_CONTENT)
        .end();
    })
    .catch(error => {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Error: Unable to delete the resource' });
    });
}

/**
 * @author Daniel Jimenez <jimenezdaniel87@gmail.com>
 * @function commentList
 * @param {Object} req HTTP request object
 * @param {Object} res HTTP response object
 * @description Show all comments from a post on the database
 */
exports.commentList = function commentList(req, res) {
  // Pagination for comments
  let sliceStart = req.query.page * req.query.limit - req.query.limit;
  let sliceEnd = sliceStart + req.query.limit;

  Post.findById(req.params.postId).exec()
    .then(post => {
      res.json(post.comments.slice(sliceStart, sliceEnd))
    })
    .catch((err) => {
      res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: err });
    });
};

/**
 * @author Daniel Jimenez <jimenezdaniel87@gmail.com>
 * @function commentStore
 * @param {Object} req HTTP request object
 * @param {Object} res HTTP response object
 * @description Store a comment inside a post
 */
exports.commentStore = function commentStore(req, res) {
  Post.findById(req.params.postId).exec()
    .then(post => {
      post.comments.unshift({
        body: req.body.body,
        userId: req.user._id
      })

      return post.save()
    })
    .then(post => res.json(post.comments[0]))
    .catch(error => {
      res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: error });
    });
};

/**
 * @author Daniel Jimenez <jimenezdaniel87@gmail.com>
 * @function showComment
 * @param {Object} req HTTP request object
 * @param {Object} res HTTP response object
 * @description Show a comment by its id
 */
exports.showComment = function showComment(req, res) {
  Post.findById(req.params.postId).exec()
    .then(post => {
      let commentId = mongoose.mongo.ObjectID(req.params.commentId);
      let comment = _.find(post.comments, { _id: commentId })

      if (!comment) return Promise.reject(new Error('The comment does not exist'));

      res.json(comment);
    })
    .catch((err) => {
      res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: err.toString() });
    });
}

/**
 * @author Daniel Jimenez <jimenezdaniel87@gmail.com>
 * @function updateComment
 * @param {Object} req HTTP request object
 * @param {Object} res HTTP response object
 * @description Update a comment by its id sent as a request param
 */
exports.updateComment = function updateComment(req, res) {
  Post.findById(req.params.postId).exec()
    .then(post => {
      const findComment = comment => comment.id === req.params.commentId;
      let comment = post.comments.find(findComment);
      
      if (!comment) return new Error('The comment does not exist');

      // Update comment
      comment.body = req.body.body || comment.body;
      comment.userId = req.body.userId || comment.userId;

      // Save the post the comment belongs to
      post.save()
        .then(post => {
          let comment = post.comments.find(findComment);
          res.json(comment);
        })
        .catch(err => {
          res
            .status(HttpStatus.BAD_REQUEST)
            .json({ message: err.toString() });
        });
    })
    .catch((err) => {
      res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: err.toString() });
    });
}

/**
 * @author Daniel Jimenez <jimenezdaniel87@gmail.com>
 * @function removeComment
 * @param {Object} req HTTP request object
 * @param {Object} res HTTP response object
 * @description Remove a post by its id sent as a request param
 */
exports.removeComment = function removeComment(req, res) {
  Post.findById(req.params.postId).exec()
    .then(post => {
      const findComment = comment => comment.id === req.params.commentId;
      let commentIndex = post.comments.findIndex(findComment);
      
      if (commentIndex === -1) throw new Error('The comment does not exist');
      
      // Delete comment from post comment list
      post.comments.splice(commentIndex, 1);
      
      // Persist changes
      post.save()
      .then(post => {  
        res.status(HttpStatus.NO_CONTENT);
        res.end();
      })
      .catch(err => {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: err.toString() });
      });
    })
    .catch((err) => {      
      res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: err.toString() });
    });
}