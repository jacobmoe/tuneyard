var request = require('supertest')
  , app = require('express')()
  , nock = require('nock')

var routes = require('../../../../lib/routes')
  , middleware = require('../../../../lib/middleware')
  , Playlist = require('../../../../lib/models/playlist')
  , Account = require('../../../../lib/models/account')

middleware(app)
routes(app)

describe('router: playlists', function () {
  var account, playlist

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

  beforeEach(function (done) {
    var params = {
      name: 'default',
      tracks: [{
        title: 'track1',
        source: 'Youtube',
        sourceId: '1',
        length: 1
      }],
      currentTrackIndex: 0
    }

    Playlist.create(params, function (err, p) {
      playlist = p
      done()
    })
  })

  describe('GET /:id', function () {
    context('authorized', function () {
      var agent, scope
      
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

      it('returns track at index', function (done) {

        agent
          .get('/api/playlists/' + playlist.name)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            assert.isNull(err)
            assert.ok(res.body)
            assert.equal(res.body.name, 'default')
            done()
          })
      })
    })
  })


})
