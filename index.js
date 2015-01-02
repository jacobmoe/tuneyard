process.env.NODE_ENV = process.env.NODE_ENV || 'development'

var express = require('express')
  , app = express()
  , server = require('http').Server(app)
  , io = require('socket.io')(server)

require('./lib/middleware')(app)
require('./lib/routes')(app)
require('./lib/wsServer')(io)

require('./lib/services/player').initialize(io)

app.set('port', process.env.PORT || 3000)

var listener = server.listen(app.get('port'), function () {
  console.log('listening on port', listener.address().port)
})

require('./lib/db').connect()
