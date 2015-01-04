var request = require('supertest')
  , app = require('express')()
  , nock = require('nock')

var routes = require('../../../../../lib/routes')
  , middleware = require('../../../../../lib/middleware')
  , Playlist = require('../../../../../lib/models/playlist')
  , Account = require('../../../../../lib/models/account')

middleware(app)
routes(app)

describe('router: playlists/tracks', function () {
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


      it('returns a collection of tracks', function (done) {
        agent
          .get('/api/playlists/' + playlist.name + '/tracks')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            assert.isNull(err)
            assert.isArray(res.body)
            assert.equal(res.body.length, 1)
            assert.equal(res.body[0].title, 'track1')
            done()
          })
      })
    })
  })

  describe('POST /', function () {
    context('authorized', function () {
      var agent, scope
      
      before(function (done) {
        scope = nock('https://www.googleapis.com')
        .filteringPath(function(path) {
          return '/'
        })
        .get('/')
        .reply(200, {
          items: [{
            snippet: {title: 'the title'},
            contentDetails: {duration: 'PT2M3S'}
          }]
        })
        
        done()
      }) 

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
      
      it('inserts a track in the playlist', function (done) {
        agent
          .post('/api/playlists/' + playlist.name + '/tracks')
          .send({source: 'Youtube', sourceId: '1'})
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            Playlist.findOne({_id: playlist.id}, function (err, playlist) {
              assert.isNull(err)
              assert.isArray(playlist.tracks)
              assert.equal(playlist.tracks.length, 2)
              assert.equal(playlist.tracks[1].title, 'the title')
              done()
            })
          })
      })
    })

    context('not authorized', function () {
      it('returns a 403', function (done) {
        request(app)
          .post('/api/playlists/' + playlist.name + '/tracks')
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
          .get('/api/playlists/' + playlist.name + '/tracks/0')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            assert.isNull(err)
            assert.ok(res.body)
            assert.equal(res.body.title, 'track1')
            done()
          })
      })
    })
  })

  describe('DELETE /:id', function () {
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
      
      it('removes the track at index from the playlist', function (done) {
        agent
          .delete('/api/playlists/' + playlist.name + '/tracks/0')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            Playlist.findOne({_id: playlist.id}, function (err, playlist) {
              assert.isNull(err)
              assert.isArray(playlist.tracks)
              assert.equal(playlist.tracks.length, 0)
              done()
            })
          })
      })
    })

    context('not authorized', function () {
      it('returns a 403', function (done) {
        request(app)
          .delete('/api/playlists/' + playlist.name + '/tracks/0')
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
