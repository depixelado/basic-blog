const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

// Define User Schema
const UserSchema = mongoose.Schema({
  _id: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: Date,
  updatedAt: Date
});

UserSchema.virtual('username')
  .get(function() { return this._id; })
  .set(function(username) {
    this._id = username;
  });

/* METHODS */

/**
 * @author Daniel Jimenez <jimenezdaniel87@gmail.com>
 * @public
 * @function verifyPassword
 * @param {String} password Password to be validated
 * @param {Function} cb Callback function which will be executed after the validation
 * @description verify the provided password matches with the user one
 */
UserSchema.methods.verifyPassword = function(password, cb) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};


/* HOOKS */

// Executed before each User.save() call
/**
 * @author Daniel Jimenez <jimenezdaniel87@gmail.com>
 * @private
 * @function cryptPassword
 * @param {Function} cb Callback function which will be executed after the process
 * @description Crypt provided password before being saved
 */
UserSchema.pre('save', function cryptPassword(callback) {
  let user = this;

  // Break out if password hasn't changed
  if (!user.isModified('password')) return callback();

  // Password changed so we have to hash it
  bcrypt.genSalt(5, function(err, salt) {
    if (err) return callback(err);

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return callback(err);
      user.password = hash;
      callback();
    });
  });
});

UserSchema.pre('save', function dates(callback) {
  let user = this;

  // Break out if password hasn't changed
  if (user.isNew) user.createdAt = new Date();
  user.updatedAt = new Date();

  callback();
});

module.exports = mongoose.model('users', UserSchema);