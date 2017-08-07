const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: [true, 'User ID required']
    },
    title: { 
        type: String, 
        required: [true, 'Post title required'] 
    },
    slug: { 
        type: String, 
        required: [true, 'Post slug required'] 
    },
    body: { 
        type: String, 
        required: [true, 'Post body required'] 
    },
    tags: Array,
    createdAt: Date,
    updatedAt: Date,
});

/* HOOKS */

// Executed before each PostSchema.save() call
/**
 * @author Daniel Jimenez <jimenezdaniel87@gmail.com>
 * @private
 * @function dates
 * @param {Function} cb Callback function which will be executed after the process
 * @description Updates createAt and updateAt values
 */
PostSchema.pre('save', function dates(callback) {
  let post = this;

  // Break out if password hasn't changed
  if (post.isNew) post.createdAt = new Date();
  post.updatedAt = new Date();

  callback();
});

module.exports = mongoose.model('posts', PostSchema);
