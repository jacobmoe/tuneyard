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

    it('works', function (done) {

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

})
