var request = require('supertest')
  , app = require('express')()
  , nock = require('nock')

var routes = require('../../../../../lib/routes')
  , middleware = require('../../../../../lib/middleware')
  , Playlist = require('../../../../../lib/models/playlist')
  , Account = require('../../../../../lib/models/account')
  , Source = require('../../../../../lib/models/source')

middleware(app)
routes(app)

describe('router: playlists/sources', function () {
  var account, playlist, source

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
      name: 'indie',
      type: 'reddit',
      url: 'http://reddit.com/r/indie.json'
    }

    Source.create(params, function (err, result) {
      source = result
      done()
    })
  })

  beforeEach(function (done) {
    var params = {
      name: 'default',
      sources: [source.id],
      currentSourceIndex: 0
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


      it('returns a collection of sources', function (done) {
        agent
          .get('/api/playlists/' + playlist.name + '/sources')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            assert.isNull(err)
            assert.isArray(res.body)
            assert.equal(res.body.length, 1)
            assert.equal(res.body[0].name, 'indie')
            assert.equal(res.body[0].type, 'reddit')
            assert.equal(res.body[0].url, 'http://reddit.com/r/indie.json')
            done()
          })
      })
    })
  })

  describe('POST /', function () {
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

      context('valid content type', function () {
        before(function (done) {
          scope = nock('http://reddit.com')
          .head('/r/indieheads.json')
          .reply(200, '', {
            'Content-Type': 'application/json; charset=UTF-8'
          })

          done()
        })

        it('inserts a source in the playlist', function (done) {
          var params = {
            type: 'reddit',
            name: 'indieheads',
            url: 'http://reddit.com/r/indieheads.json'
          }

          agent
          .post('/api/playlists/' + playlist.name + '/sources')
          .send(params)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            assert.isNull(err)

            Playlist.findOne({_id: playlist.id}, function (err, playlist) {
              assert.isNull(err)
              assert.isArray(playlist.sources)
              assert.equal(playlist.sources.length, 2)

              Source.findOne({_id: playlist.sources[1]}).exec(function (err, res) {
                assert.equal(res.name, 'indieheads')
                assert.equal(res.type, 'reddit')
                assert.equal(res.url, 'http://reddit.com/r/indieheads.json')
                done()
              })
            })
          })
        })

        it('returns an error if source type not supported', function (done) {
          var params = {
            type: 'notreddit',
            name: 'indieheads',
            url: 'http://reddit.com/r/indieheads.json'
          }

          agent
          .post('/api/playlists/' + playlist.name + '/sources')
          .send(params)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(415)
          .end(function(err, res) {
            assert.isNull(err)

            Playlist.findOne({_id: playlist.id}, function (err, playlist) {
              assert.isNull(err)
              assert.isArray(playlist.sources)
              assert.equal(playlist.sources.length, 1)
              done()
            })
          })
        })
      })

      context('invalid content type', function () {
        before(function (done) {
          scope = nock('http://reddit.com')
          .head('/r/notasubreddit.json')
          .reply(302, '', {
            'Content-Type': 'html/text; charset=UTF-8'
          })

          done()
        })

        it('returns a 400', function (done) {
          var params = {
            type: 'reddit',
            name: 'indieheads',
            url: 'http://reddit.com/r/notasubreddit.json'
          }

          agent
          .post('/api/playlists/' + playlist.name + '/sources')
          .send(params)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(400)
          .end(function(err, res) {
            assert.isNull(err)

            Playlist.findOne({_id: playlist.id}, function (err, playlist) {
              assert.isNull(err)
              assert.isArray(playlist.sources)
              assert.equal(playlist.sources.length, 1)
              done()
            })
          })
        })

      })

      context('invalid returned status code', function () {
        before(function (done) {
          scope = nock('http://reddit.com')
          .head('/r/notasubreddit.json')
          .reply(404, '', {
            'Content-Type': 'application/json; charset=UTF-8'
          })

          done()
        })

        it('returns a 400', function (done) {
          var params = {
            type: 'reddit',
            name: 'indieheads',
            url: 'http://reddit.com/r/notasubreddit.json'
          }

          agent
          .post('/api/playlists/' + playlist.name + '/sources')
          .send(params)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(400)
          .end(function(err, res) {
            assert.isNull(err)

            Playlist.findOne({_id: playlist.id}, function (err, playlist) {
              assert.isNull(err)
              assert.isArray(playlist.sources)
              assert.equal(playlist.sources.length, 1)
              done()
            })
          })
        })

      })

    })

    context('not authorized', function () {
      it('returns a 403', function (done) {
        request(app)
          .post('/api/playlists/' + playlist.name + '/sources')
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

      it('returns source at index', function (done) {
        agent
          .get('/api/playlists/' + playlist.name + '/sources/0')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            assert.isNull(err)
            assert.ok(res.body)
            assert.equal(res.body.type, 'reddit')
            assert.equal(res.body.name, 'indie')
            assert.equal(res.body.url, 'http://reddit.com/r/indie.json')
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

      it('removes the source at index from the playlist', function (done) {
        agent
          .delete('/api/playlists/' + playlist.name + '/sources/0')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            Playlist.findOne({_id: playlist.id}, function (err, playlist) {
              assert.isNull(err)
              assert.isArray(playlist.sources)
              assert.equal(playlist.sources.length, 0)
              done()
            })
          })
      })
    })

    context('not authorized', function () {
      it('returns a 403', function (done) {
        request(app)
          .delete('/api/playlists/' + playlist.name + '/sources/0')
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
