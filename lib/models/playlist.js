var mongoose = require('mongoose')


var droppedSchema = new mongoose.Schema({
  origin: {type: String, default: null},
  originId: {type: String, default: null}
}, {toJSON: {virtuals: true}})

droppedSchema.virtual('createdAt').get(function() {
  return this._id.getTimestamp()
})


var trackSchema = new mongoose.Schema({
  title: {type: String, default: null},
  artist: {type: String, default: null},
  origin: {type: String, default: null},
  originId: {type: String, default: null},
  source: { type: mongoose.Schema.Types.ObjectId, ref: 'Source' },
  length: {type: Number, default: null}
}, {toJSON: {virtuals: true}})

trackSchema.virtual('createdAt').get(function() {
  return this._id.getTimestamp()
})


var fields = {
  name: {type: String, required: true, unique: true, default: null},
  currentTrackIndex: {type: Number, default: null},
  startTime: {type: Number, default: null},
  sources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Source' }],
  tracks: [trackSchema],
  dropped: [droppedSchema]
}


var schema = new mongoose.Schema(fields, {
  toJSON: {virtuals: true}
})

schema.virtual('createdAt').get(function() {
  return this._id.getTimestamp()
})

schema.methods.insertTrack = function (track) {
  var current = this.currentTrackIndex || 0

  this.tracks.splice(current + 1, 0, track)
}

schema.methods.nextTrack = function () {
  if (this.currentTrackIndex >= this.tracks.length - 1) {
    this.currentTrackIndex = 0
  } else {
    this.currentTrackIndex = this.currentTrackIndex + 1
  }
}

module.exports = mongoose.model('Playlist', schema);
