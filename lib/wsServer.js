var messagesCtrl = require('./controllers/socket/messages')
  , playlistsCtrl = require('./controllers/socket/playlists')

module.exports = function (io) {

  io.on('connection', function (socket) {
    console.log('socket connection')

    socket.on('disconnect', function () {
      if (!socket.userName) return

      var content = socket.userName + ' disconnected'
      messagesCtrl.create(io, socket, {content: content})
    })

    socket.on('messages:init:client', function (data) {
      if (socket.playlistName) socket.leave(socket.playlistName)

      socket.userName = data.user.name
      socket.playlistName = data.playlist.name

      socket.join(data.playlist.name)

      var plName = data.playlist.name
      if (plName == 'default') plName = 'home'

      messagesCtrl.create(io, socket, {
        content: data.user.name + ' connected to ' + plName
      }, true)
      messagesCtrl.initialize(io, socket, data)
    })

    socket.on('notices:send', function (data) {
      io.sockets.emit('notices:new', data)
    })

    socket.on('messages:create', function (data) {
      messagesCtrl.create(io, socket, data)
    })


    socket.on('playlists:getCurrent', function (data) {
      playlistsCtrl.findOne(socket, data)
    })

    socket.on('playlists:trackDropped', function (data) {
      playlistsCtrl.trackDropped(socket, data)
    })

    socket.on('playlists:skipTrack:request', function (data) {
      playlistsCtrl.skipTrack(io, socket, data)
    })

    socket.on('player:loaded', function (data) {
      playlistsCtrl.initClient(socket, data)
    })


  })

}
