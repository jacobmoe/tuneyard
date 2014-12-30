var path = require('path')
  , express = require('express')

module.exports = function (app) {
  require('./middleware/passport')(app)
}
