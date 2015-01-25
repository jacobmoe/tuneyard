var service = require('../../../lib/services/youtube')

describe('service: youtube', function () {

  describe('videoIdFromUrl', function () {
    it('returns an id from valid youtube urls' , function (done) {
      var url = 'https://www.youtube.com/watch?v=t-8bY1qYJtU'
      assert.equal(service.videoIdFromUrl(url), 't-8bY1qYJtU')

      url = 'http://www.youtube.com/watch?v=t-8bY1qYJtU'
      assert.equal(service.videoIdFromUrl(url), 't-8bY1qYJtU')

      url = 'https://www.youtube.com/watch?v=e3GIIgLAdQ8&list=RDMqATDfhb-lw&index=5'
      assert.equal(service.videoIdFromUrl(url), 'e3GIIgLAdQ8')

      url = '//www.youtube.com/embed/roh_9isQcEY'
      assert.equal(service.videoIdFromUrl(url), 'roh_9isQcEY')

      url = 'https://www.notyoutube.com/watch?v=e3GIIgLAdQ8'
      assert.isNull(service.videoIdFromUrl(url))

      done()
    })
  })

  describe('lengthFromDuration', function () {
    it('parses youtube duration format and returns length in seconds' , function (done) {
      var duration = 'PT1H14M43S'
      assert.equal(service.lengthFromDuration(duration), 4483)

      done()
    })
  })

})
