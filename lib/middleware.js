var path = require('path')
  , express = require('express')
  , bodyParser = require('body-parser')
  , session = require('cookie-session')
  , cookieParser = require('cookie-parser')

module.exports = function (app) {
  app.use('/assets', express.static(path.join(__dirname, '../assets/_build')))
  app.use(express.static(path.join(__dirname, '../public')))
  app.set('views', path.join(__dirname, '../views'))
  app.set('view engine', 'jade')
  app.set('view options', { pretty: true })

  app.use(cookieParser())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))

  app.use(session({
    keys: [
      '1cd6677527948bc7239e88fe23d30ce6aecef8c746c63e16a160bb14ee29d56d3fe11e24a23e4fff7f52ffb051df4863',
      '5af8de61f173fbf252fb8d06ed7c0c38a5a7e0f617c3ffb636a91e7da70e066df4a964fcfce5c85cc4952afaffa761e7'
    ]
  }))

  require('./middleware/passport')(app)
}
