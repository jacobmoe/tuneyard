var mongoose = require('mongoose')

var connections

mongoose.connection.on('connected', function(ref) {
  console.log('connected to mongo')
  connections = true
})

mongoose.connection('error', function (err) {
  console.log('mongo connection error:', err)
  connected = false
}
                    
mongoose.connection.on('disconnected', function () {
  console.log('disconnected from mongo')
  connected = false
})

function connect(done) {
  var done = done || function () {}

  var nodeEnv = process.env.NODE_ENV || 'development'
  var dbName = "tuneyard-" + nodeEnv

  if (!connected)
    mongoose.connect('mongodb://localhost/' + dbName, {}, cb)
}

module.exports = {
  connect: connect
}
