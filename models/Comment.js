const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, 'User ID required']
  },
  body: { 
    type: String, 
    required: [true, 'Comment body required'] 
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

/* HOOKS */

// Executed before each CommentSchema.save() call
/**
 * @author Daniel Jimenez <jimenezdaniel87@gmail.com>
 * @private
 * @function dates
 * @param {Function} cb Callback function which will be executed after the process
 * @description Updates createAt and updateAt values
 */
CommentSchema.pre('save', function dates(callback) {
  let post = this;

  // Break out if password hasn't changed
  if (post.isNew) post.createdAt = new Date();
  post.updatedAt = new Date();

  callback();
});

module.exports = CommentSchema;
