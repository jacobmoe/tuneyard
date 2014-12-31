var Message = require('./models/message')

module.exports = function (io) {

  io.on('connection', function (socket) {
    console.log('socket connection')

    Message.find({})
    .sort({'_id': -1})
    .limit(10)
    .populate('account')
    .exec(function(err, messages){
      if (err) socket.emit('init-message-error', err)
      else socket.emit('init-messages', messages)
    })

    socket.on('add-new-message', function (data) {
      Message.create(data, function (err, message) {

        Message.populate(message, 'account', function (err, m) {
          console.log('new message', err, message.toJSON())

          if (err) socket.emit('new-message-error', err)
          else if (m) io.sockets.emit('new-message', message.toJSON())
        })

      })

    })
  })

}
