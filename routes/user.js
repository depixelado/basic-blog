const express = require('express');
const pagination = require('./../middlewares/pagination');
const router = express.Router();
const userController = require('./../controllers/userController');

/* GET request to show all Users. */
router.route('/').get(pagination, userController.list);

/* POST request to create a User */
router.route('/').post(userController.store);

/* GET request to show a User */
router.route('/:userId').get(userController.show)

/* PUT request to update a User */
router.route('/:userId').put(userController.update)

/* DELETE request to delete a User */
router.route('/:userId').delete(userController.remove);

module.exports = router;