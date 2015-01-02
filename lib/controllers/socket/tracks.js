var Playlist = require('../../models/playlist')
  , youtube = require('../../services/youtube')
  , player = require('../../services/player')

module.exports = {
  create: function (io, socket, data, playlistName) {
    playlistName = playlistName || 'default'
    
    Playlist.findOne({name: playlistName}, function (err, playlist) {
      var youtubeId = youtube.videoIdFromUrl(data.content)

      if (err) return socket.emit('tracks:new:error', err)
      if (!playlist) return socket.emit('tracks:new:error', {message: 'missing playlist'})
      if (!youtubeId) return socket.emit('tracks:new:error', {message: 'invalid url'})

      youtube.getVideoData(youtubeId, function (err, params) {
        if (err) return socket.emit('tracks:new:error', err)

        params.source = 'Youtube'
        
        var current = playlist.currentTrackId || 0
        
        playlist.tracks.splice(current, 0, params)

        playlist.save(params, function (err) {
          console.log('new track added: ', err, track)

          if (err) return socket.emit('tracks:new:error', err)

          io.sockets.emit('tracks:new', params)
        })

      })
    })

  }
}
