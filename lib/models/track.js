var mongoose = require('mongoose')

var fields = {
  title: {type: String, required: true, default: null},
  source: {type: String, required: true, default: null},
  length: {type: String, required: true, default: null}
}

var schema = new mongoose.Schema(fields, {
  toJSON: {virtuals: true}
})

schema.virtual('createdAt').get(function() {
  return this._id.getTimestamp()
})

module.exports = mongoose.model('Track', schema);
