const express = require('express');

const pagination = require('./../middlewares/pagination');
const requiredFields = require('./../middlewares/requiredFields');
const sortingFields = require('./../middlewares/sortingFields');
const postController = require('./../controllers/postController');
const auth = require('./../middlewares/auth');

const router = express.Router();

/* GET request to show all Posts. */
router.route('/').get(
  pagination,
  requiredFields,
  sortingFields,
  postController.list
);

/* POST request to create a Post */
router.route('/').post(
  auth.isAuthenticated,
  postController.store
);

/* GET request to show a Post */
router.route('/:postId').get(
  requiredFields,
  sortingFields,
  postController.show
);

/* PUT request to update a Post */
router.route('/:postId').put(
  auth.isAuthenticated,
  auth.isAuthenticated, 
  postController.update
)

/* DELETE request to delete a Post */
router.route('/:postId').delete(postController.remove);


/** COMENTS */

/* GET request to show all Comments. */
router.route('/:postId/comments').get(
  pagination,
  requiredFields,
  sortingFields,
  postController.commentList
);

/* GET request to show a Post */
router.route('/:postId/comments/:commentId').get(
  requiredFields,
  sortingFields,
  postController.showComment
);

/* POST request to create a Comment */
router.route('/:postId/comments').post(
  auth.isAuthenticated,
  postController.commentStore
);

/* PUT request to update a Comment */
router.route('/:postId/comments/:commentId').put(
  auth.isAuthenticated,
  postController.updateComment
);

/* DELETE request to delete a Post */
router.route('/:postId/comments/:commentId').delete(
  auth.isAuthenticated,
  postController.removeComment
);

module.exports = router;