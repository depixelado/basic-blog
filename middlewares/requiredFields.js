const _ = require('lodash');

/**
 * @author Daniel Jimenez <jimenezdaniel87@gmail.com>
 * @public
 * @function requiredFields
 * @param {any} req HTTP Request
 * @param {any} res HTTP Response
 * @param {any} next Function to pass to the next middleware
 * @description Turn fields string into an array of fields
 */
module.exports = function requiredFields(req, res, next) {
  if(req.query.fields === undefined){
    req.query.fields = [];
  } else {
    req.query.fields = _.merge([], req.query.fields.split(','));
  }

  next();
}