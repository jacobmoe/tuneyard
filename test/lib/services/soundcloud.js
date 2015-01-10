var nock = require('nock')

var service = require('../../../lib/services/soundcloud')

describe('service: soundcloud', function () {
  describe('getTrackData', function () {

    var url = 'https://soundcloud.com/asthmatickitty/sufjan-stevens-silver-gold'
    var expected = {
      id: '1',
      title: 'the title',
      duration: '10000'
    }

    beforeEach(function () {
      nock('https://api.soundcloud.com')
      .filteringPath(function(path) {
        return '/'
      })
      .get('/')
      .reply(200, expected)
    })

    it('returns track data', function (done) {

      service.getTrackData(url, function (err, data) {
        assert.deepEqual(data, {
          id: '1',
          title: 'the title',
          length: '10000'
        })
        done()
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

})
