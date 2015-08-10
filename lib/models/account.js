var mongoose = require('mongoose')
  , bcrypt = require('bcrypt')

var fields = {
  email: {
    type: String,
    default: null,
    unique: true,
    required: true,
    match: [/.+\@.+\..+/, 'is invalid'],
    index: { unique: true }
  },
  name: {
    type: String,
    default: null,
    index: { unique: true }
  },
  hash: { type: String, default: null, required: true },
  salt: { type: String, default: null, required: true }
}

var schema = new mongoose.Schema(fields, {
  toJSON: {
    transform: function(doc, ret, options) {
      delete ret.salt
      delete ret.hash
      return ret
    }
  }
})

schema.plugin(require('./plugins/attrAccessor'), 'password')
schema.plugin(require('./plugins/attrAccessor'), 'passwordConfirmation')

schema.methods.validPassword = function (attempt) {
  return bcrypt.compareSync(attempt, this.hash)
}

schema.methods.setPassword = function (done) {
  var self = this

  if (!this.password)
    return done({password: 'is required'})

  if (this.password !== this.passwordConfirmation)
    return done({password: 'must match password confirmation'})

  bcrypt.genSalt(10, function(err, salt) {
    if (err) return done(err)

    bcrypt.hash(self.password, salt, function(err, hash) {
      if (err) return done(err)

      self.hash = hash
      self.salt = salt

      done(null, self)
    })
  })
}

schema.pre('validate', function(next) {
  var self = this

  if (this.password) {
    this.setPassword(function (err) {
      if (err && err.password) self.invalidate('password', err.password)

      next()
    })
  } else {
    next()
  }
})

module.exports = mongoose.model('Account', schema);
