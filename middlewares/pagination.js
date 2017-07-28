const utils = require('./../utils');
const config = require('./../config');

/**
 * @author Daniel Jimenez <jimenezdaniel87@gmail.com>
 * @public
 * @function pagination
 * @param {any} req HTTP Request
 * @param {any} res HTTP Response
 * @param {any} next Function to pass to the next middleware
 */
module.exports = function pagination(req, res, next) {
  req.query.page = utils.sanatizePage(req.query.page);
  req.query.limit = utils.sanatizeLimitPerPage(
    req.query.limit,
    config.app.minPageLimit,
    config.app.maxPageLimit
  );

  next();
}