var mongoose = require('mongoose')
  , passportLocalMongoose = require('passport-local-mongoose')
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

schema.methods.validPassword = function (attempt) {
  return bcrypt.compareSync(attempt, this.hash)
}

schema.methods.setPassword = function (password, confirmation, done) {
  var self = this

  if (password !== confirmation)
    return done({message: 'password and password confirmation do not match'})

  bcrypt.genSalt(10, function(err, salt) {
    if (err) return done(err)

    bcrypt.hash(password, salt, function(err, hash) {
      if (err) return done(err)
      
      self.hash = hash
      self.salt = salt
      
      done(null, self)
    })
  })
}

module.exports = mongoose.model('Account', schema);
