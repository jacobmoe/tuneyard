process.env.NODE_ENV = 'test'

var async = require('async')

var chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
var Q = require('q')
var spies = require('chai-spies')
var sinonChai = require("sinon-chai")

chai.should()
chai.use(chaiAsPromised)
chai.use(sinonChai)

global.chaiAsPromised = chaiAsPromised
global.AssertionError = chai.AssertionError
global.Assertion = chai.Assertion
global.assert = chai.assert

global.defer = Q.defer

global.clearCollections = function (done) {
  var jobs = []
  var collections = ['account']
  
  collections.forEach(function (col) {
    jobs.push(function (cb) {
      require('../lib/models/' + col).remove({}, cb)
    })
  })
  
  async.parallel(jobs, done)
} 

global.connectDb = function(done) {
  require('../lib/db').connect(done)
}
