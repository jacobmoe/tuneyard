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
  username: {
    type: String,
    default: null,
    required: true,
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

module.exports = mongoose.model('Account', schema);
