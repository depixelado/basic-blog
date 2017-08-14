require(__root + 'test/integration/loadFixtures');

const request = require('supertest');

// Api path to posts
const postResourcePath = '/api/posts';

describe('POSTS', function() {
  describe('POST posts (' + postResourcePath + ')', function() {
    var tests = [
      { 
        description: 'creates a Post and return it as it was saved',
        post: { title : 'Test post', body : 'Test body', tags : 'cat, dog, bird, super computer' }, 
        expected: { title : 'Test post', slug : 'test-post', body : 'Test body', tags : ['cat', 'dog', 'bird', 'super computer'] }
      },
      { 
        description: 'creates a Post casting the values',
        post: { title : 3, body : 4, tags : 'cat' }, 
        expected: { title : '3', slug : '3', body : '4', tags : ['cat'] }
      },
      { 
        description: 'creates a Post with a slug from a title with hyphens and capital letters',
        post: { title : 'HelloWorld-yeah', body : 4, tags : 'cat' }, 
        expected: { title : 'HelloWorld-yeah', slug : 'hello-world-yeah', body : '4', tags : ['cat'] }
      }
    ];

    tests.forEach(function(test) {
      it(test.description, function(done) {
        request(app)
          .post(postResourcePath)
          .auth('admin', 'admin')
          .set('Accept', 'application/json')
          .send(test.post)
          .expect('Content-Type', /json/)
          .expect(checkResponseObjectProperties.bind(null, test.expected))
          .expect(200, done)
      });
    });
  });

  describe('GET posts (' + postResourcePath + ')', function() {
    it('get a list of posts', function(done) {
      request(app)
        .get(postResourcePath)
        .auth('admin', 'admin')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done)
        .expect(function checkThereIsAnArrayOfElements(res) {
          res.body.should.be.Array;
        });
    });

    it('gets a list of one post when limit is 1', function(done) {
      request(app)
        .get(postResourcePath + '?limit=1')      
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

  describe('GET posts/:postId (' + postResourcePath + '/:postId)', function() {
    it('creates a post and try to access it by get', function(done) {
      var post = {
        title : 'Test post to be get', 
        body : 'Test body get one', 
        tags : 'cat, computer'
      };

      var expectedResult = {
        title : 'Test post to be get', 
        slug : 'test-post-to-be-get', 
        body : 'Test body get one', 
        tags : ['cat', 'computer']
      };

      var checkPost = function checkPost(done, error, res) {
        request(app)
          .get(postResourcePath + '/' + res.body._id)
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
        .post(postResourcePath)
        .auth('admin', 'admin')
        .send(post)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(checkPost.bind(null, done))
    });

    it('gets 404 when posts does not exists', function(done) {
      request(app)
        .get(postResourcePath + '/random')
        .auth('admin', 'admin')
        .expect('Content-Type', /json/)
        .expect(404, done)
    });
  });

  describe('PUT posts/:postId (' + postResourcePath + '/:postId', function() {
    it('updates a post and values change', function(done) {
      var updatePost = function updatePost(done, error, res){
        let post = {
          title: 'test title updated',
          body: 'body text updated',
          tags: 'dog, cat'
        };

        let expectedResult = {
          title : 'test title updated', 
          slug : 'test-title-updated', 
          body : 'body text updated', 
          tags : ['dog', 'cat']
        }
        
        request(app)
          .put(postResourcePath + '/' + res.body[0]._id)
          .auth('admin', 'admin')
          .set('Accept', 'application/json')
          .send(post)
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
        .get(postResourcePath)      
        .auth('admin', 'admin')
        .expect('Content-Type', /json/)
        .end(updatePost.bind(null, done))
    });
  });

  describe('DELETE posts (' + postResourcePath + '/:postId/comments)', function() {
    it('delete a post', function(done) {
      var deleteComment = function storeComment(done, error, res){
        request(app)
          .delete(postResourcePath + '/' + res.body[0]._id)
          .auth('admin', 'admin')
          .set('Accept', 'application/json')
          .expect(204)
          .end((err) => {
              if (err) throw err;
              done();
          });
      };

      // Get first post
      request(app)
        .get(postResourcePath)      
        .auth('admin', 'admin')
        .expect('Content-Type', /json/)
        .end(deleteComment.bind(null, done))
    });
  });
});

describe('POSTS - COMMENTS', function() {
  describe('POST comments (' + postResourcePath + '/:postId/comments)', function() {
    it('store a new comment', function(done) {
      var storeComment = function storeComment(done, error, res){
        let comment = {
          body: 'Comment body test'
        };

        request(app)
          .post(postResourcePath + '/' + res.body[0]._id + '/comments')
          .auth('admin', 'admin')
          .set('Accept', 'application/json')
          .send(comment)
          .expect('Content-Type', /json/)
          .expect(200)
          .expect((res) => {
            res.body.body.should.be.a.String();
            res.body.body.should.be.equal(comment.body);
            res.body.createdAt.should.be.a.String();
            res.body.updatedAt.should.be.a.String();
          })
          .end((err) => {
              if (err) throw err;
              done();
          });
      };

      // Get first post
      request(app)
        .get(postResourcePath)      
        .auth('admin', 'admin')
        .expect('Content-Type', /json/)
        .end(storeComment.bind(null, done))
    });
  });

  describe('GET comments (' + postResourcePath + '/:postId/comments)', function() {
    it('retrieves a list of comments', function(done) {
      var getComments = function getComments(done, error, res){
        request(app)
          .get(postResourcePath + '/' + res.body[0]._id + '/comments')
          .auth('admin', 'admin')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err) => {
              if (err) throw new Error(err);
              done();
          });
      };

      // Get first post
      request(app)
        .get(postResourcePath)      
        .auth('admin', 'admin')
        .expect('Content-Type', /json/)
        .end(getComments.bind(null, done))
    });

    it('retrieves a list of one comment when limit=1', function(done) {
      var getComments = function getComments(done, error, res){
        request(app)
          .get(postResourcePath + '/' + res.body[0]._id + '/comments?limit=1&page=2')
          .auth('admin', 'admin')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .expect((res) => {
            res.body.should.be.an.Array();
            res.body.length.should.be.equal(1);
          })
          .end((err) => {
            if (err) throw err;
            done();
          });
      };

      // Get first post
      // TODO: Query a post with comments. 
      // It assummes now post has comment but it could not. Some times it makes not pass the test
      request(app)
        .get(postResourcePath)      
        .auth('admin', 'admin')
        .expect('Content-Type', /json/)
        .end(getComments.bind(null, done))
    });
  });

  describe('PUT comments (' + postResourcePath + '/:postId/comments)', function() {
    it('update a comment', function(done) {
      var updateComment = function storeComment(done, error, res){
        let comment = {
          body: 'updated body'
        };

        request(app)
          .put(postResourcePath + '/' + res.body[0]._id + '/comments/' + res.body[0].comments[0]._id)
          .auth('admin', 'admin')
          .set('Accept', 'application/json')
          .send(comment)
          .expect('Content-Type', /json/)
          .expect(200)
          .expect((res) => {
            res.body.body.should.be.a.String();
            res.body.body.should.be.equal(comment.body);
          })
          .end((err) => {
              if (err) throw err;
              done();
          });
      };

      // Get first post
      request(app)
        .get(postResourcePath)      
        .auth('admin', 'admin')
        .expect('Content-Type', /json/)
        .end(updateComment.bind(null, done))
    });
  });

  describe('DELETE comments (' + postResourcePath + '/:postId/comments)', function() {
    it('delete a comment', function(done) {
      var deleteComment = function storeComment(done, error, res){
        request(app)
          .delete(postResourcePath + '/' + res.body[0]._id + '/comments/' + res.body[0].comments[0]._id)
          .auth('admin', 'admin')
          .set('Accept', 'application/json')
          .expect(204)
          .end((err) => {
              if (err) throw err;
              done();
          });
      };

      // Get first post
      request(app)
        .get(postResourcePath)      
        .auth('admin', 'admin')
        .expect('Content-Type', /json/)
        .end(deleteComment.bind(null, done))
    });
  });
});