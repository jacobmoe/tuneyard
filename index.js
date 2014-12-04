var express = require('express')
var mongoose = require('mongoose');
var app = express()

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.set('port', process.env.PORT || 3000)

var server = app.listen(app.get('port'), function () {
  console.log('listening on port', server.address().port)
})

mongoose.connection.on('connected', function(ref) {
  console.log('connected to mongo')
})

var nodeEnv = process.env.NODE_ENV || 'development'
var dbName = "tuneyard-" + nodeEnv

mongoose.connect('mongodb://localhost/' + dbName)
