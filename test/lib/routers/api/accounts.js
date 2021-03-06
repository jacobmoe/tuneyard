var request = require('supertest')
  , app = require('express')()

var routes = require('../../../../lib/routes')
  , middleware = require('../../../../lib/middleware')
  , Account = require('../../../../lib/models/account')

middleware(app)
routes(app)

describe('router: accounts', function () {
  var account

  before(connectDb)
  beforeEach(clearCollections)

  beforeEach(function (done) {
    var params = {
      email: 'test@example.com',
      password: 'thepassword',
      passwordConfirmation: 'thepassword'
    }
    Account.create(params, function (err, a) {
      account = a

      done()
    })
  })

  describe('GET /', function () {
    context('authorized', function () {
      var agent

      beforeEach(function (done) {
        agent = request.agent(app)

        agent
          .post('/api/sessions')
          .send({
            email: account.email,
            password: 'thepassword'
          })
          .expect(200)
          .end(done)
      })

      it('returns a collection of accounts', function (done) {
        agent
          .get('/api/accounts')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            assert.isNull(err)
            assert.isArray(res.body)
            done()
          })
      })
    })
  })

  describe('GET /', function () {
    context('not authorized', function () {
      it('returns a collection of accounts', function (done) {
        request(app)
          .get('/api/accounts')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(403)
          .end(function(err, res) {
            assert.isNull(err)
            assert.equal(res.body.message, 'must be logged in')
            done()
          })
      })
    })
  })

})
