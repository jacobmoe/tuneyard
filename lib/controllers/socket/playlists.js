var Playlist = require('../../models/playlist')

module.exports = {
  findOne: function (socket, data) {
    var playlistName = data.playlistName || 'default'
    
    Playlist.findOne({name: playlistName}, function (err, playlist) {
      socket.emit('playlists:current', playlist.id)
    })
  }
}
