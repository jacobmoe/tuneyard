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
      socket.userName = data.name
      messagesCtrl.create(io, socket, {content: data.name + ' connected'})
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

    socket.on('playlists:skipTrack', function (data) {
      playlistsCtrl.skipTrack(socket, data)
    })

    socket.on('player:loaded', function (data) {
      playlistsCtrl.initClient(socket, data)
    })


  })

}
