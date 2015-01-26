var nock = require('nock')

var service = require('../../../lib/services/soundcloud')

describe('service: soundcloud', function () {
  describe('getTrackData', function () {

    context('track is streamable', function () {
      var url = 'https://soundcloud.com/asthmatickitty/sufjan-stevens-silver-gold'
      var returned = {
        id: '1',
        title: 'the title',
        duration: '10000',
        user: {username: 'the user'},
        streamable: true
      }

      beforeEach(function () {
        nock('https://api.soundcloud.com')
        .filteringPath(function(path) {
          return '/'
        })
        .get('/')
        .reply(200, returned)
      })

      it('accepts a url and returns track data', function (done) {
        service.getTrackData(url, function (err, data) {
          var expected = {
            originId: '1',
            title: 'the title',
            length: 10,
            artist: 'the user'
          }
          assert.deepEqual(data, expected)
          done()
        })
      })

      it('accepts an id and returns track data', function (done) {
        service.getTrackData('123', function (err, data) {
          var expected = {
            originId: '1',
            title: 'the title',
            length: 10,
            artist: 'the user'
          }
          assert.deepEqual(data, expected)
          done()
        })
      })
    })

    context('track is not streamable', function () {
      var url = 'https://soundcloud.com/asthmatickitty/sufjan-stevens-silver-gold'
      var returned = {
        id: '1',
        title: 'the title',
        duration: '10000',
        user: {username: 'the user'},
        streamable: false
      }

      beforeEach(function () {
        nock('https://api.soundcloud.com')
        .filteringPath(function(path) {
          return '/'
        })
        .get('/')
        .reply(200, returned)
      })

      it('returns track data', function (done) {
        service.getTrackData(url, function (err, data) {
          assert.ok(err)
          assert.equal(err.message, 'track is not streamable')
          done()
        })
      })
    })
  })

  describe('isSoundcloudUrl', function () {
    it('checks if url is valid soundcloud url', function (done) {
      var url = "https://soundcloud.com/asthmatickitty/sufjan-stevens-silver-gold"
      assert.isTrue(service.isSoundcloudUrl(url))

      url = "https://soundcloud.com/musikedidiable/handclaps"
      assert.isTrue(service.isSoundcloudUrl(url))

      url = "https://snd.sc/bluesoapmusic/brown-eyes-the-new-southern-electrikk"
      assert.isFalse(service.isSoundcloudUrl(url))

      url = "https://soundcloud.com/subpop"
      assert.isFalse(service.isSoundcloudUrl(url))

      url = "https://roundmound.com/bluesoapmusic/brown-eyes-the-new-southern-electrikk"
      assert.isFalse(service.isSoundcloudUrl(url))

      url = "http://www.nytimes.com/"
      assert.isFalse(service.isSoundcloudUrl(url))

      url = "http://www.nytimes.com/"
      assert.isFalse(service.isSoundcloudUrl(url))

      url = "not a url"
      assert.isFalse(service.isSoundcloudUrl(url))

      done()
    })
  })

  describe('trackIdFromEmbedUrl', function () {
    it('returns a track id from an embed url', function (done) {
      var url = "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/160820944&amp;color=ff5500&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false"
      assert.equal(service.trackIdFromEmbedUrl(url), '160820944')

      url = "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/180496202&amp;color=ff5500&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false"
      assert.equal(service.trackIdFromEmbedUrl(url), '180496202')

      done()
    })
  })
})
