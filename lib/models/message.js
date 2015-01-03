var mongoose = require('mongoose')

var fields = {
  content: {type: String, required: true, default: null},
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    default: null
  }
}

var schema = new mongoose.Schema(fields, {
  toJSON: {virtuals: true}
})

schema.virtual('createdAt').get(function() {
  return this._id.getTimestamp()
})

module.exports = mongoose.model('Message', schema);
