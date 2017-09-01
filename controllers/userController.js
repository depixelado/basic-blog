require('mongoose-pagination');
const _ = require('lodash');
const HttpStatus = require('http-status-codes');

const User = require('./../models/User');
const utils = require('./../utils');

const userHiddenApiFields = ['__v', 'password'];
const userDefaultSortingMap = {
  updateAt: -1
};

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
    .then((doc) => res.json({ data: user }))
    .catch(err => {
      res
        .status(HttpStatus.NOT_FOUND)
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
  // Get required fields
  const fieldsMap = utils.getRequiredFieldsMap(req, userHiddenApiFields);

  // Get sorting fields
  const sortMap = utils.getResourceSortMap(req, userDefaultSortingMap);

  User.find(null, fieldsMap)
    .sort(sortMap)
    .paginate(req.query.page, req.query.limit)
    .exec()
    .then(users => res.json({ data: users }))
    .catch(err => {
      res
        .status(HttpStatus.NOT_FOUND)
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
  // Get required fields
  const fieldsMap = utils.getRequiredFieldsMap(req, userHiddenApiFields);

  User.findById(req.params.userId, fieldsMap).exec()
    .then(user => {
      if (user === null) {
        res
        .status(HttpStatus.NOT_FOUND)
        .end();
      }

      res.json({ data: user });
    })
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
 * @description Update a user by its id sent as a request param
 */
exports.update = function updateUser(req, res) {
  User.findById(req.params.userId).exec()
    .then(user => {
      user.username = req.body.username
      user.password = req.body.password

      return user.save()
    })
    .then(user => res.json({ data: user }))
    .catch(error => {
      res
        .status(HttpStatus.NOT_FOUND)
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
        .status(HttpStatus.NO_CONTENT)
        .end();
    })
    .catch(error => {
      res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'Error: Unable to delete the resource' });
    });
}

/**
 * @author Daniel Jimenez <jimenezdaniel87@gmail.com>
 * @function me
 * @param {Object} req HTTP request object
 * @param {Object} res HTTP response object
 * @description Returns authenticated user resource. Used as well to check authentication
 */
exports.me = function me(req, res) {
  // Get required fields
  const fieldsMap = utils.getRequiredFieldsMap(req, userHiddenApiFields);
  
  User.findById(req.user._id, fieldsMap).exec()
    .then(user => {
      res.json({ 
        data: user 
      });
    })
    .catch((err) => {
      res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: err });
    });
}

