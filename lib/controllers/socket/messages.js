var Message = require('../../models/message')

module.exports = {
  initialize: function (io, socket, data) {
    Message.find({})
    .sort({'_id': -1})
    .limit(20)
    .populate('account')
    .exec(function(err, messages){
      if (err) socket.emit('messages:init:error', err)
      else socket.emit('messages:init', messages)
    })
  },

  create: function (io, socket, data) {
    Message.create(data, function (err, message) {
      Message.populate(message, 'account', function (err, m) {
        if (err) socket.emit('messages:error', err)
        else if (m) io.sockets.emit('messages:display', message)
      })

    })
  }
}
