var BasicStrategy = require('passport-http').BasicStrategy;
var passport = require('passport');
var User = require('../models/User');

/**
 * @author Daniel Jimenez <jimenezdaniel87@gmail.com>
 * @private 
 * @function basicAuthentication
 * @param {String} username User name
 * @param {String} password Password to authenticate the suer
 * @param {Function} callback Function to be executed either the authentication is valid or not
 */
function basicAuthentication(username, password, callback) {
  User.findOne({ _id: username }, function (err, user) {
    if (err) { return callback(err); }

    // No user found with that username
    if (!user) { return callback(null, false); }

    // Make sure the password is correct
    user.verifyPassword(password, function(err, isMatch) {
      if (err) { return callback(err); }

      // Password did not match
      if (!isMatch) { return callback(null, false); }

      // Success
      return callback(null, user);
    });
  });
}

// Define passport basic authentication strategy
passport.use(new BasicStrategy(basicAuthentication));

exports.isAuthenticated = passport.authenticate('basic', { session : false });