const _ = require('lodash');
const User = require('./../models/User');
const utils = require('./../utils');
require('mongoose-pagination');

/**
 * @author Daniel Jimenez <jimenezdaniel87@gmail.com>
 * @function store
 * @param {Object} req HTTP request object
 * @param {Object} res HTTP response object
 * @description Store a user into the database with the data received from the request
 */
exports.store = function store(req, res) {
  // Create a new User instance with the value to be stored
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });

  user.save()
    .then((doc) => res.json(user))
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
 * @description Show all users on the database
 */
exports.list = function list(req, res) {
  User.find()
    .paginate(req.query.page, req.query.limit)
    .exec()
    .then(users => res.json(users))
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
 * @description Show a user by its id sent as a request param
 */
exports.show = function show(req, res) {
  User.findById(req.params.userId).exec()
    .then(user => res.json(user))
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
 * @description Update a user by its id sent as a request param
 */
exports.update = function updateUser(req, res) {
  User.findById(req.params.userId).exec()
    .then(user => {
      user.username = req.body.username
      user.password = req.body.password

      return user.save()
    })
    .then(user => res.json(user))
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
 * @description Remove a user by its id sent as a request param
 */
exports.remove = function remove(req, res) {
  const queryObject = {
    _id: req.params.userId
  };

  User.remove(queryObject)
    .then(() => {
      res
        .status(204)
        .end();
    })
    .catch(error => {
      res
        .status(400)
        .json({ message: 'Error: Unable to delete the resource' });
    });
}