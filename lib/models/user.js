var mongoose = require('mongoose')

var schema = new mongoose.Schema({
  name: { type: String, default: null , required: true },
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

module.exports = mongoose.model('User', schema);
