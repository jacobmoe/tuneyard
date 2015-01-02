var Playlist = require('../../models/playlist')
  , youtube = require('../../services/youtube')
  , player = require('../../services/player')

module.exports = {
  initClient: function (socket, data) {
    Playlist.findOne({_id: data.playlistId}, function (err, playlist) {
      if (err || !playlist)
        return socket.emit('tracks:new:error', {message: 'missing playlist'})

      var currentTrackId = playlist.currentTrackIndex

      var track = playlist.tracks[currentTrackId]

      if (!track) return socket.emit('player:initialize:error', {
        message: 'no track found'
      })

      var elapsed = (Date.now() - playlist.startTime)/1000

      var response = track.toJSON()
      response.startAt = track.length - (track.length - elapsed)
      
      socket.emit('player:initialize', response)
    })
  }

}
