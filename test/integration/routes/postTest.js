require(__root + 'test/integration/loadFixtures');

const request = require('supertest');

// Api path to posts
const postResourcePath = '/api/posts';

/**
 * Fixture seeds
 * 
 * Every seed has to export a generate method which will be responsable of
 * seeding the database. That method has to return a promise
 */
const fixtureSeeds = [
  require(__root + 'fixtures/users'),
  require(__root + 'fixtures/posts')
];


describe('POSTS', function() {
  before(function(done) {
    db.connect(db.MODE_TEST)
      .then(() => done());
  })

  beforeEach(function(done) {
    db.drop()
      // Seed database with fixtures
      .then(() => {
        return db.seed(fixtureSeeds);
      })
      // Terminate beforeEach
      .then(() => done())
  })
  
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
        .get(postResourcePath + '?limit=1')      .expect('Content-Type', /json/)
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

      var checkPost = function checkPost(res) {
        request(app)
          .get(postResourcePath + '/' + res.body._id)
          .auth('admin', 'admin')
          .expect('Content-Type', /json/)
          .expect(checkResponseObjectProperties.bind(null, expectedResult))
          .expect(200);
      }

      request(app)
        .post(postResourcePath)
        .auth('admin', 'admin')
        .send(post)
        .expect('Content-Type', /json/)
        .expect(checkPost)
        .expect(200, done)
    });

    it('gets 404 when posts does not exists', function(done) {
      request(app)
        .get(postResourcePath + '/random')
        .auth('admin', 'admin')
        .expect('Content-Type', /json/)
        .expect(404, done)
    });
  });

});