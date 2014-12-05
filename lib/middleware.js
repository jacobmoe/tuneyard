var path = require('path')
  , express = require('express')
  , bodyParser = require('body-parser')
  , cookieParser = require('cookie-parser')
  , session = require('cookie-session')
  , config = require('config')
  , compression = require('compression')

module.exports = function (app) {
  app.set('views', path.join(__dirname, '../views'))

  app.set('view engine', 'jade')

  app.use(compression())

  app.use('/assets', express.static(path.join(__dirname, '../dist')))
  app.use(express.static(path.join(__dirname, '../dist')))

  app.use(cookieParser())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(session({keys: config.session.keys}))

  require('./middleware/passport')(app)
}
