var request = require('supertest')
  , app = require('express')()
  , bodyParser = require('body-parser')

var router = require('../../../lib/routers/api/accounts')

app.use(bodyParser.json())
app.use('/api/accounts', router)

describe('router: accounts', function () {

  before(connectDb)
  beforeEach(clearCollections)

  describe('GET /', function () {
    it('returns a collection of accounts', function (done) {
      request(app)
        .get('/api/accounts')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          assert.isArray(res.body)
          done()
        })
      })
  })

})
