const _ = require('lodash');

/**
 * @author Daniel Jimenez <jimenezdaniel87@gmail.com>
 * @public
 * @function sortingFields
 * @param {any} req HTTP Request
 * @param {any} res HTTP Response
 * @param {any} next Function to pass to the next middleware
 * @description Turn fields string into an array of fields
 */
module.exports = function sortingFields(req, res, next) {
  if(req.query.sort === undefined){
    req.query.sort = [];
  } else {
    req.query.sort = _.merge([], req.query.sort.split(','));
  }

  next();
}