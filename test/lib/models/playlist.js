var Playlist = require('../../../lib/models/playlist')

describe('model: Playlist', function () {

  before(connectDb)
  beforeEach(clearCollections)

  describe('validations', function () {
    it('requires a name', function (done) {
      Playlist.create({}, function (err, playlist) {
        assert.ok(err)
        assert.notOk(playlist)
        assert.equal('ValidatorError', err.errors.name.name)

        done()
      })
    })
  })

  describe('#insertTrack', function () {
    var playlist

    beforeEach(function (done) {
      var params = {
        name: 'default',
        tracks: [{
          title: 'track1',
          origin: 'Youtube',
          originId: '1',
          length: 1
        }],
        currentTrackIndex: 0
      }

      Playlist.create(params, function (err, p) {
        assert.isNull(err)
        assert.ok(p)
        assert.equal(p.tracks.length, 1)
        playlist = p
        done()
      })
    })

    it('inserts a track after the current track', function (done) {
      var track = {
        title: 'track2',
        origin: 'Youtube',
        originId: '2',
        length: 1
      }

      playlist.insertTrack(track)

      assert.equal(playlist.tracks.length, 2)
      assert.equal(playlist.tracks[1].title, 'track2')

      track.title = 'track3'
      track.originId = '3'

      playlist.insertTrack(track)

      assert.equal(playlist.tracks.length, 3)
      assert.equal(playlist.tracks[0].title, 'track1')
      assert.equal(playlist.tracks[1].title, 'track3')
      assert.equal(playlist.tracks[2].title, 'track2')

      track.title = 'track4'
      track.originId = '4'

      playlist.currentTrackIndex = 1
      playlist.insertTrack(track)

      assert.equal(playlist.tracks.length, 4)
      assert.equal(playlist.tracks[0].title, 'track1')
      assert.equal(playlist.tracks[1].title, 'track3')
      assert.equal(playlist.tracks[2].title, 'track4')
      assert.equal(playlist.tracks[3].title, 'track2')

      done()
    })
  })

  describe('#nextTrack', function () {
    var playlist

    beforeEach(function (done) {
      var params = {
        name: 'default',
        tracks: [
          {
            title: 'track1',
            origin: 'Youtube',
            originId: '1',
            length: 1
          },
          {
            title: 'track2',
            origin: 'Youtube',
            originId: '2',
            length: 2
          }
        ],
        currentTrackIndex: 0
      }

      Playlist.create(params, function (err, p) {
        assert.isNull(err)
        assert.ok(p)
        assert.equal(p.tracks.length, 2)
        playlist = p
        done()
      })
    })

    it('sets currentTrackIndex to next', function (done) {
      assert.equal(0, playlist.currentTrackIndex)

      playlist.nextTrack()

      assert.equal(1, playlist.currentTrackIndex)

      playlist.nextTrack()

      assert.equal(0, playlist.currentTrackIndex)

      done()
    })
  })

  describe('dropped schema', function () {
    var playlist

    beforeEach(function (done) {
      var params = {
        name: 'default',
        dropped: [
          {
            origin: 'Youtube',
            originId: '3',
          },
          {
            origin: 'Soundcloud',
            originId: '4',
          }
        ],
        currentTrackIndex: 0
      }

      Playlist.create(params, function (err, p) {
        playlist = p
        done()
      })
    })

    it('includes a createdAt virtual', function (done) {
      assert.ok(playlist.dropped[0].createdAt)

      done()
    })
  })

})
