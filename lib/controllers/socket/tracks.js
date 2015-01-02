var Playlist = require('../../models/playlist')
  , youtube = require('../../services/youtube')
  , player = require('../../services/player')

module.exports = {
  initClient: function (socket, data) {
    playlistName = data.playlist || 'default'

    Playlist.findOne({name: playlistName}, function (err, playlist) {
      if (err)
        return socket.emit('tracks:new:error', err)
      if (!playlist)
        return socket.emit('tracks:new:error', {message: 'missing playlist'})

      var currentTrackId = playlist.currentTrackIndex

      var track = playlist.tracks[currentTrackId]

      if (!track) return socket.emit('player:initialize:error', {
        message: 'no track found'
      })

      var elapsed = (Date.now() - playlist.startTime)/1000

      data = track.toJSON()
      data.startAt = track.length - elapsed

      socket.emit('player:initialize', data)
    })
  },

  create: function (io, socket, data, playlistName) {
    playlistName = playlistName || 'default'

    Playlist.findOne({name: playlistName}, function (err, playlist) {
      var youtubeId = youtube.videoIdFromUrl(data.content)

      if (err)
        return socket.emit('tracks:new:error', err)
      if (!playlist)
        return socket.emit('tracks:new:error', {message: 'missing playlist'})
      if (!youtubeId)
        return socket.emit('tracks:new:error', {message: 'invalid url'})

      youtube.getVideoData(youtubeId, function (err, params) {
        if (err) return socket.emit('tracks:new:error', err)

        params.source = 'Youtube'
        params.sourceId = youtubeId

        var current = playlist.currentTrackId || 0

        playlist.tracks.splice(current, 0, params)

        playlist.save(function (err) {
          console.log('new track added: ', err, track)

          if (err) return socket.emit('tracks:new:error', err)

          io.sockets.emit('tracks:new', params)
        })

      })
    })

  }
}
