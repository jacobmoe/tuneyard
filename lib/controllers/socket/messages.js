var _ = require('lodash')

var Message = require('../../models/message')

module.exports = {
  initialize: function (io, socket, data) {
    Message.find({ playlistName: data.playlist.name })
    .sort({'_id': -1})
    .limit(50)
    .populate('account')
    .exec(function(err, messages){
      if (err) socket.emit('messages:init:error', err)
      else socket.emit('messages:init', messages)
    })
  },

  create: function (io, socket, data, emitToAllRooms) {
    data.playlistName = socket.playlistName

    Message.create(data, function (err, message) {
      Message.populate(message, 'account', function (err, m) {
        if (err) {
          socket.emit('messages:error', err)
        } else if (m) {
          if (emitToAllRooms) io.sockets.emit('messages:display', message)
          else io.to(socket.playlistName).emit('messages:display', message)
        }
      })
    })
  }

}
