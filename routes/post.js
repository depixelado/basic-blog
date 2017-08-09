const express = require('express');
const pagination = require('./../middlewares/pagination');
const postController = require('./../controllers/postController');
const router = express.Router();

/* GET request to show all Posts. */
router.route('/').get(pagination, postController.list);

/* POST request to create a Post */
router.route('/').post(postController.store);

/* GET request to show a Post */
router.route('/:postId').get(postController.show)

/* PUT request to update a Post */
router.route('/:postId').put(postController.update)

/* DELETE request to delete a Post */
router.route('/:postId').delete(postController.remove);

/* GET request to show all Comments. */
router.route('/:postId/comments').get(pagination, postController.commentList);

/* POST request to create a Comment */
router.route('/:postId/comments').post(postController.commentStore);

module.exports = router;