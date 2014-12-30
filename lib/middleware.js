var path = require('path')
  , express = require('express')
  , bodyParser = require('body-parser')

module.exports = function (app) {
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))

  require('./middleware/passport')(app)
}
