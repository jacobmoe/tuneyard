var passport = require('passport')
  , localStrategy = require('passport-local').Strategy

var User = require('../models/user')

module.exports = function (app) {
  passport.use(new LocalStrategy(function (username, password, done) {
    User.findOne({username: username}, function (err, user) {
      if (err) {return done(err)}

      if (!user || !user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect username or password' })
      }

      return done(null, user)
    })
  }))

  // Set session cookie for user
  passport.serializeUser(function (user, done) {
    done(null, user.id)
  })

  // Find user via session cookie
  passport.deserializeUser(function (id, done) {
    User.find({id: id}, function(err, user) {
      if (user) {
        done(null, user)
      } else {
        var err = {email: 'Not authenticated'}
        done(null, false, err)
      }
    })
  })
}
