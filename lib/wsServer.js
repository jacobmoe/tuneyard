module.exports = function (io) {

  io.on('connection', function (socket) {
    console.log('socket connection')

    socket.emit('news', { hello: 'world' });

    socket.on('test', function (data) {
      console.log(data);
    })
  })

}
