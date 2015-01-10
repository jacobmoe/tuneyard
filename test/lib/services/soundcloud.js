var service = require('../../../lib/services/soundcloud')

describe('service: soundcloud', function () {

  describe('getTrackId', function () {
    it('works' , function (done) {
      var url = 'https://soundcloud.com/asthmatickitty/sufjan-stevens-silver-gold'

      service.getTrackId(url, function (err, data) {
        console.log("test =====>", err, data)
        done()
      })
    })
  })

})
