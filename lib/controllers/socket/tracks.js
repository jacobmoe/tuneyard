var request = require('request')

var Track = require('../../models/track')

// http://stackoverflow.com/a/10315969/624466
function youtubeVideoIdFromUrl(url) {
  var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/
  return (url.match(p)) ? RegExp.$1 : false
}

function getYoutubeVideoData(videoUrl, done) {
  var endpoint = 'https://www.youtube.com/oembed?format=json&url='
  // http://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=rSU8ftmmhmw&format=json
  var url = endpoint + videoUrl
  
  request.get(url, function (err, res, body) {
    done(err, body)
  })
}

module.exports = {
  create: function (io, socket, data) {
    var youtubeId = youtubeVideoIdFromUrl(data.content)

    if (youtubeId) {
      getYoutubeVideoData(data.content, function (err, body) {
        console.log("========>", err, body)
      })
    }
  }
}
