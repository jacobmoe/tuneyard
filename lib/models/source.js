var mongoose = require('mongoose')

var fields = {
  url: {type: String, default: null},
  originUrl: {type: String, default: null},
  type: {type: String, default: null},
  name: {type: String, default: null}
}

var schema = new mongoose.Schema(fields, {
  toJSON: {virtuals: true}
})

schema.virtual('createdAt').get(function() {
  return this._id.getTimestamp()
})

module.exports = mongoose.model('Source', schema)
