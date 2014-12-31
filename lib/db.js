var mongoose = require('mongoose')

var connected

mongoose.connection.on('connected', function(ref) {
  console.log('connected to mongo')
  connected = true
})

mongoose.connection.on('error', function (err) {
  console.log('mongo connection error:', err)
  connected = false
})
                    
mongoose.connection.on('disconnected', function () {
  console.log('disconnected from mongo')
  connected = false
})

function connect(done) {
  var done = done || function () {}

  var nodeEnv = process.env.NODE_ENV || 'development'
  var dbName = "tuneyward-" + nodeEnv
  
  if (connected) return done()

  mongoose.connect('mongodb://localhost/' + dbName, {}, done)
}

module.exports = {
  connect: connect
}
