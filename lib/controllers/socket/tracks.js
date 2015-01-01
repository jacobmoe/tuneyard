var Track = require('../../models/track')
  , youtube = require('../../services/youtube')

module.exports = {
  create: function (io, socket, data) {
    var youtubeId = youtube.videoIdFromUrl(data.content)

    if (youtubeId) {
      youtube.getVideoData(youtubeId, function (err, params) {
        if (err) return socket.emit('tracks:new:error', err)
        
        params.source = 'Youtube'
        
        Track.create(params, function (err, track) {
          console.log('new track: ', err, track)

          if (err) return socket.emit('tracks:new:error', err)
          
          io.sockets.emit('tracks:new', track)
        })
        
      })
    }
  }
}
