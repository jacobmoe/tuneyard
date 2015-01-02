var Playlist = require('../../models/playlist')
  , player = require('../../services/player')

module.exports = {
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
  }
}
