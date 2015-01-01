var messagesCtrl = require('./controllers/socket/messages')
  , tracksCtrl = require('./controllers/socket/tracks')

module.exports = function (io) {

  io.on('connection', function (socket) {
    console.log('socket connection')

    socket.on('init-chat', function (data) {
      messagesCtrl.initialize(io, socket, data)
    })

    socket.on('add-new-message', function (data) {
      messagesCtrl.create(io, socket, data)
      tracksCtrl.create(io, socket, data)
    })
  })

}
