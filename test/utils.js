global.checkResponseObjectProperties = function checkResponseObjectProperties(object, res) {
  for(property in object) {
    res.body.should.have.property(property, object[property]);
  }
}