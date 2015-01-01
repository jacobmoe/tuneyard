var config = require('config')
  , request = require('request')
  , moment = require('moment')

var endpoint = 'https://www.googleapis.com/youtube/v3/'

// http://stackoverflow.com/a/10315969/624466
function videoIdFromUrl(url) {
  var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/
  return (url.match(p)) ? RegExp.$1 : null
}

function lengthFromDuration(str) {
  return (moment.duration(str)._milliseconds / 1000)
}

function getVideoData(id, done) {
  var url = endpoint + 
            'videos?id=' + id +
            '&part=contentDetails,snippet' +
            '&key=' + config.get('apiKeys.youtube')
  
  request.get(url, function (err, res, body) {
    if (err) return done(err)
    
    var data = JSON.parse(body)
    
    var items = data.items || []
    var item = items[0] || {}
    var snippet = item.snippet || {}
    var details = item.contentDetails || {}

    var params = {
      title: snippet.title,
      duration: lengthFromDuration(details.duration)
    }

    done(null, params)
  })
}

module.exports = {
  videoIdFromUrl: videoIdFromUrl,
  getVideoData: getVideoData,
  lengthFromDuration: lengthFromDuration
}
