var request = require('supertest')
  , app = require('express')()

var router = require('../../../lib/routers/api/sessions')
  , middleware = require('../../../lib/middleware')
  , Account = require('../../../lib/models/account')

middleware(app)
app.use('/api/sessions', router)

describe('router: sessions', function () {
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

  describe('POST /', function () {
    it('returns an account and sets a session cookie', function (done) {
      request(app)
        .post('/api/sessions')
        .send({email: 'test@example.com', password: 'thepassword'})
        .expect('Content-Type', /json/)
        .expect(function (res) {
          assert.match(res.headers['set-cookie'][0], /express:sess=/)
        })
        .expect(200)
        .end(function(err, res) {
          assert.equal(res.body.email, 'test@example.com')
          done()
        })
    })

    it('returns a 401 for invalid users', function (done) {
      request(app)
        .post('/api/sessions')
        .send({email: 'test@example.com', password: 'notthepassword'})
        .expect(401)
        .end(done)
    })
  })
  
  describe('GET /', function () {
    context('authenticated', function () {
      var agent

      beforeEach(function (done) {
        agent = request.agent(app)

        agent
          .post('/api/sessions')
          .send({
            email: 'test@example.com',
            password: 'thepassword'
          })
          .expect(200)
          .end(done)
      })
      
      it('returns the logged-in user', function (done) {
        agent
          .get('/api/sessions')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            assert.equal(res.body.email, 'test@example.com')
            done()
          })
      })
    })

    context('not authenticated', function () {
      it('returns a 404', function (done) {
        request(app)
          .get('/api/sessions')
          .expect('Content-Type', /json/)
          .expect(404)
          .end(done)
      })
    })
  })

  describe('DELETE /', function () {
    context('authenticated', function () {
      var agent

      beforeEach(function (done) {
        agent = request.agent(app)

        agent
          .post('/api/sessions')
          .send({
            email: 'test@example.com',
            password: 'thepassword'
          })
          .expect(200)
          .end(done)
      })
      
      it('ends the session', function (done) {
        agent
          .delete('/api/sessions')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            
            agent
              .get('/api/sessions')
              .expect('Content-Type', /json/)
              .expect(404)
              .end(done)

          })
      })
    })

  })

})
