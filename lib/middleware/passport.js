var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy

var Account = require('../models/account')

module.exports = function (app) {
  var opts = { usernameField: 'email' }

  passport.use(new LocalStrategy(opts, function (email, password, done) {
    Account.findOne({email: email}, function (err, account) {
      if (err) { return done(err) }

      if (!account || !account.validPassword(password)) {
        return done(null, false, { message: 'Incorrect email or password' })
      }

      return done(null, account)
    })
  }))

  passport.serializeUser(function (account, done) {
    done(null, account.id)
  })

  passport.deserializeUser(function (id, done) {
    Account.findById(id, function(err, account) {
      if (account) {
        done(null, account)
      } else {
        var err = {email: 'Not authenticated'}
        done(null, false, err)
      }
    })
  })

  app.use(passport.initialize())
  app.use(passport.session())
}
