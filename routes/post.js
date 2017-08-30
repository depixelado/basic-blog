const express = require('express');
const pagination = require('./../middlewares/pagination');
const requiredFields = require('./../middlewares/requiredFields');
const sortingFields = require('./../middlewares/sortingFields');
const postController = require('./../controllers/postController');

const router = express.Router();

/* GET request to show all Posts. */
router.route('/').get(
  pagination,
  requiredFields,
  sortingFields,
  postController.list
);

/* POST request to create a Post */
router.route('/').post(postController.store);

/* GET request to show a Post */
router.route('/:postId').get(
  requiredFields,
  sortingFields,
  postController.show
);

/* PUT request to update a Post */
router.route('/:postId').put(postController.update)

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
router.route('/:postId/comments').post(postController.commentStore);

/* PUT request to update a Comment */
router.route('/:postId/comments/:commentId').put(postController.updateComment);

/* DELETE request to delete a Post */
router.route('/:postId/comments/:commentId').delete(postController.removeComment);

module.exports = router;