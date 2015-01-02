var mongoose = require('mongoose')

var fields = {
  name: {type: String, unique: true, default: null},
  currentTrackIndex: {type: Number, default: null},
  startTime: {type: Number, default: null},
  tracks: [{
    title: {type: String, default: null},
    source: {type: String, default: null},
    sourceId: {type: String, default: null},
    length: {type: String, default: null}
  }]
}

var schema = new mongoose.Schema(fields, {
  toJSON: {virtuals: true}
})

schema.virtual('createdAt').get(function() {
  return this._id.getTimestamp()
})

module.exports = mongoose.model('Playlist', schema);
