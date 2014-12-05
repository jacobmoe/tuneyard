var mongoose = require('mongoose')
  , passportLocalMongoose = require('passport-local-mongoose')

var schema = new mongoose.Schema({
  email: {
    type: String,
    default: null,
    unique: true,
    required: true,
    match: [/.+\@.+\..+/, 'is invalid'],
    index: { unique: true }
  },
}, {
  toJSON: {
    transform: function(doc, ret, options) {
      delete ret.salt
      delete ret.hash
      return ret
    }
  }
})

// schema.plugin(require('mongoose-unique-validator'), { message: 'is not unique'})
// schema.plugin(require('passport-local-mongoose'), { usernameField: 'email' })
schema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', schema);
