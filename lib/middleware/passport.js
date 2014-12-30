var passport = require('passport')
  , localStrategy = require('passport-local').Strategy

var Account = require('../models/account')

module.exports = function (app) {
  passport.use(new LocalStrategy(function (email, password, done) {
    Account.findOne({email: email}, function (err, account) {
      if (err) { return done(err) }

      if (!account || !account.validPassword(password)) {
        return done(null, false, { message: 'Incorrect email or password' })
      }

      return done(null, account)
    })
  }))

  app.use(passport.initialize())
}
