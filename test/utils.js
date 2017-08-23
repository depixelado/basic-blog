const request = require('supertest');

global.checkResponseObjectProperties = function checkResponseObjectProperties(object, res) {
  for(property in object) {
    res.body.data.should.have.property(property, object[property]);
  }
}