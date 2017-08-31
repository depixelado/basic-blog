const express = require('express');

const pagination = require('./../middlewares/pagination');
const requiredFields = require('./../middlewares/requiredFields');
const userController = require('./../controllers/userController');
const sortingFields = require('./../middlewares/sortingFields');
const auth = require('./../middlewares/auth');

const router = express.Router();

/* GET request to show all Users. */
router.route('/').get(
  pagination,
  requiredFields,
  sortingFields,
  userController.list
);

/* POST request to create a User */
router.route('/').post(
  auth.isAuthenticated,
  userController.store
);

/* GET request to show a User */
router.route('/:userId').get(
  requiredFields, 
  userController.show
);

/* PUT request to update a User */
router.route('/:userId').put(
  auth.isAuthenticated,
  userController.update
);

/* DELETE request to delete a User */
router.route('/:userId').delete(
  auth.isAuthenticated,
  userController.remove
);

module.exports = router;