const dotenv = require('dotenv');

// Load environment vars
dotenv.load();

const config = {
  db: {
    host : process.env.DB_HOST || 'localhost',
    username : process.env.DB_USER,
    password : process.env.DB_PASS,
    name : process.env.DB_NAME
  },
  app: {
    port : process.env.PORT || 3000,

    // Pagination
    pageLimit : process.env.PAGE_LIMIT || 10,
    minPageLimit : process.env.MIN_PAGE_LIMIT || 1,
    maxPageLimit : process.env.MAX_PAGE_LIMIT || 200
  },

  test : {
    db: {
      host : process.env.TEST_DB_HOST || 'localhost',
      username : process.env.TEST_DB_USER,
      password : process.env.TEST_DB_PASS,
      name : process.env.TEST_DB_NAME || 'test'
    },
  }
};

module.exports = config;

