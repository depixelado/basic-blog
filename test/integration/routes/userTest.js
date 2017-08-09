require(__root + 'test/integration/loadFixtures');

const request = require('supertest');
const bcrypt = require('bcrypt-nodejs');
const User = require(__root + 'models/User');

// Api path to users
const userResourcePath = '/api/users';

describe('USERS', function() {
  describe('POST users (' + userResourcePath + ')', function() {
    var tests = [
      { 
        description: 'creates an User and return it as it was saved',
        user: { username : 'user1', password: '1234' }, 
        expected: {username: 'user1'}
      },
      { 
        description: 'creates an User casting the values',
        user: { username : 3, password : 4}, 
        expected: { username : '3'}
      }
    ];

    tests.forEach(function(test) {
      it(test.description, function(done) {
        request(app)
          .post(userResourcePath)
          .auth('admin', 'admin')
          .set('Accept', 'application/json')
          .send(test.user)
          .expect('Content-Type', /json/)
          .expect(checkResponseObjectProperties.bind(null, test.expected))
          .expect(200, done)
      });
    });
  });

  describe('GET users (' + userResourcePath + ')', function() {
    it('get a list of users', function(done) {
      request(app)
        .get(userResourcePath)
        .auth('admin', 'admin')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done)
        .expect(function checkThereIsAnArrayOfElements(res) {
          res.body.should.be.Array;
        });
    });

    it('gets a list of one user when limit is 1', function(done) {
      request(app)
        .get(userResourcePath + '?limit=1')      
        .expect('Content-Type', /json/)
        .auth('admin', 'admin')
        .set('Accept', 'application/json')
        .expect(200, done)
        .expect(function checkThereIsAnArrayOfElements(res) {
          res.body.should.be.Array;
          res.body.length.should.equal(1);
        });
    });
  });

  describe('GET users/:postId (' + userResourcePath + '/:postId)', function() {
    it('creates an user and try to access it by get', function(done) {
      let user = {
        username: 'new-name',
        password: '1234'
      };

      var expectedResult = {
        username: 'new-name',
      };

      var checkUser = function checkPost(done, error, res) {
        request(app)
          .get(userResourcePath + '/' + res.body._id)
          .auth('admin', 'admin')
          .expect('Content-Type', /json/)
          .expect(200)
          .expect(checkResponseObjectProperties.bind(null, expectedResult))
          .end((error) => {
            if (error) throw new Error(error);
            done();
          });
      }

      request(app)
        .post(userResourcePath)
        .auth('admin', 'admin')
        .send(user)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(checkUser.bind(null, done))
    });

    it('gets 404 when users does not exists', function(done) {
      request(app)
        .get(userResourcePath + '/random')
        .auth('admin', 'admin')
        .expect('Content-Type', /json/)
        .expect(404, done)
    });
  });

  describe('PUT users/:postId (' + userResourcePath + '/:postId', function() {
    it('updates an user and values change', function(done) {
      var updatePost = function updatePost(done, error, res){
        let user = {
          username: 'new-name',
          password: '1234'
        };

        let expectedResult = {
          username: 'new-name',
        }
        
        request(app)
          .put(userResourcePath + '/' + res.body[0]._id)
          .auth('admin', 'admin')
          .set('Accept', 'application/json')
          .send(user)
          .expect('Content-Type', /json/)
          .expect(200)
          .expect(checkResponseObjectProperties.bind(null, expectedResult))
          .end((err) => {
              if (err) throw new Error(err);
              done();
          });
      };

      // Get first post
      request(app)
        .get(userResourcePath)      
        .auth('admin', 'admin')
        .expect('Content-Type', /json/)
        .end(updatePost.bind(null, done))
    });
  });
});