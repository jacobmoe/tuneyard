var messagesCtrl = require('./controllers/socket/messages')
  , tracksCtrl = require('./controllers/socket/tracks')
  , playlistsCtrl = require('./controllers/socket/playlists')

module.exports = function (io) {

  io.on('connection', function (socket) {
    console.log('socket connection')

    socket.on('playlists:getCurrent', function (data) {
      playlistsCtrl.findOne(socket, data)
    })

    socket.on('playlists:trackDropped', function (data) {
      playlistsCtrl.trackDropped(socket, data)
    })

    socket.on('messages:init:client', function (data) {
      messagesCtrl.initialize(io, socket, data)
    })
    
    socket.on('notices:send', function (data) {
      io.sockets.emit('notices:new', data)
    })

    socket.on('messages:new', function (data) {
      messagesCtrl.create(io, socket, data)
    })

    socket.on('player:loaded', function (data) {
      tracksCtrl.initClient(socket, data)
    })

    
  })

}
