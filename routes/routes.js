const express = require('express');
const router = express.Router();

/* Post routes */
router.use('/posts', require('./post'));

/* User routes */
router.use('/users', require('./user'));

module.exports = router;