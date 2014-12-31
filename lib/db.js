var mongoose = require('mongoose')
  , config = require('config')

var connected

var dbName = config.get('db.name')

mongoose.connection.on('connected', function(ref) {
  console.log('connected to mongo db', dbName)
  connected = true
})

mongoose.connection.on('error', function (err) {
  console.log('mongo connection error:', err)
  connected = false
})
                    
mongoose.connection.on('disconnected', function () {
  console.log('disconnected from mongo db', dbName)
  connected = false
})

function connect(done) {
  var done = done || function () {}

  
  if (connected) return done()
  
  mongoose.connect('mongodb://localhost/' + dbName, done)
}

module.exports = {
  connect: connect
}
