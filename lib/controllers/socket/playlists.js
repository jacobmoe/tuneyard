var Playlist = require('../../models/playlist')
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
      response.index = currentTrackId
      
      socket.emit('player:initialize', response)
    })
  },

  findOne: function (socket, data) {
    var playlistName = data.playlistName || 'default'
    
    Playlist.findOne({name: playlistName}, function (err, playlist) {
      socket.emit('playlists:current', playlist.id)
    })
  },

  trackDropped: function (socket, data) {
    Playlist.findOne({_id: data.playlistId}, function (err, playlist) {
      player.stop(playlist)
      player.play(playlist)
    })
  },

  skipTrack: function (socket, data) {
    Playlist.findOne({_id: data.playlistId}, function (err, playlist) {
      if (err || !playlist)
        return socket.emit('tracks:new:error', {message: 'missing playlist'})

      playlist.nextTrack()

      playlist.save(function (err) {
        if (err) return
        
        player.stop(playlist)
        player.play(playlist)
      })
    })
  } 
}
