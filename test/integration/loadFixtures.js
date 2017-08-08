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