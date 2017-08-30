const utils = {
  /**
   * @author Daniel Jimenez <jimenezdaniel87@gmail.com>
   * @function slufigy
   * @param {String} text Text to slufigy
   * @return {String} Slugified text
   * @description Slugify a text
   */
  slugify: function slugify(text = "") {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
  },

  /**
   * @author Daniel Jimenez <jimenezdaniel87@gmail.com>
   * @function string2TagsArray
   * @param {String} tagString Comma separated tags
   * @return {Array} Returns an array of tags
   * @description Convert a string of comma separated tags on a tags array
   */
  string2TagsArray: function string2TagsArray(tagString = "") {
    return tagString.split(",").map(x => x.trim());
  },

  /**
   * @author Daniel Jimenez <jimenezdaniel87@gmail.com>
   * @function sanatizePage
   * @param {Number} page Page number to be sanatized
   * @return {Number} Returns a sanatized page number
   * @description Get an unknown formated page and sanatize it
   */
  sanatizePage: function sanatiezePage(page = 1) {
    if (!/^[1-9][0-9]*$/.test(page)) page = 1;

    return page;
  },

  /**
   * @author Daniel Jimenez <jimenezdaniel87@gmail.com>
   * @function sanatizeLimitPerPage
   * @param {Number} limit Max number of elements per page
   * @param {Number} minLimit Minimum allowed number of elements per page
   * @param {Number} maxLimit Max allowed number of elements per page
   * @return {Number} Returns a sanatized page limit
   * @description Sanatize max element per page number
   */
  sanatizeLimitPerPage: function sanatizeLimitPerPage(limit = 10, minLimit = 1, maxLimit = 100) {
    var limitPerPage = Number(limit);

    // Test if limitPerPage is a valid number
    if (!/^[1-9][0-9]*$/.test(limitPerPage)) limitPerPage = 1;

    // Assure limitPerPage is inside the allowedlimits
    if (limitPerPage < minLimit ) limitPerPage = minLimit;
    if (limitPerPage > maxLimit ) limitPerPage = maxLimit;

    return limitPerPage;
  },

  /**
   * @author Daniel Jimenez <jimenezdaniel87@gmail.com>
   * @function getRequiredFieldsMap
   * @param {Object} req Request object
   * @param {Array} hiddenApiFields Fields that are not allowed to be displayed
   * @param {String} belongsTo Namespace the fields belongs to. i.e belongsTo = comment => comment.body
   * @return {Object} Required fields map
   * @description Build a required fields map to be displayed on the API. 
   * Supports nested fields by adding a point. i.e comment.body
   */
  getRequiredFieldsMap: function getRequiredFieldsMap(req, hiddenApiFields = [], belongsTo = false) {
    if (req.query.fields.length === 0) {
      return hiddenApiFields
        .reduce(
          (accumulator, value) => {
            accumulator[value] = 0;
            return accumulator;
           },
          {} 
        );
    }

    return req.query.fields
      // Add namespace to the required fiels
      .map(field => (belongsTo) ? `${belongsTo}.${field}` : field)
      
      // Not include hidden API fields
      .filter(field => hiddenApiFields.indexOf(field) === -1)

      // Map fields
      .reduce(
        (accumulator, value) => {
          accumulator[value] = 1;
          return accumulator;
         },
        {} 
      );
  }
};

module.exports = utils;
