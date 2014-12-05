process.env.NODE_ENV = process.env.NODE_ENV || 'development'

var express = require('express')
  , app = express()

require('lib/middleware')(app)

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.set('port', process.env.PORT || 3000)

var server = app.listen(app.get('port'), function () {
  console.log('listening on port', server.address().port)
})

require('./lib/db').connect()
