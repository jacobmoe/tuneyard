var Playlist = require('../models/playlist')

var events = new (require('events').EventEmitter)()

function scheduleNext(playlist) {
  var nextIndex = playlist.currentTrackIndex + 1
  if (nextIndex > playlist.tracks.length - 1) nextIndex = 0

  var track = playlist.tracks[nextIndex]
  setTimeout(function () {
    playlist.currentTrackIndex = nextIndex
    playlist.startTime = Date.now()

    playlist.save(function (err) {
      console.log('play next track', err, track)

      events.emit('newCurrentTrack', track)

      scheduleNext(playlist)
    })
  }, track.length * 1000)
}

function play(playlist) {
  if (playlist.currentTrackIndex) {
    track = playlist.tracks[playlist.currentTrackIndex]
  } else {
    track = playlist.tracks[0]
    playlist.currentTrackIndex = 0
  }

  if (!track)
    return events.emit('error', {message: 'default playlist is empty'})

  playlist.startTime = Date.now()

  playlist.save(function (err) {
    events.emit('newCurrentTrack', track)

    scheduleNext(playlist)
  })
}

function initialize(io) {
  events.on('newCurrentTrack', function (data) {
    io.sockets.emit('tracks:startNew', data)
  })

  events.on('error', function (err) {
    io.sockets.emit('playlists:error', err)
  })
  
  Playlist.findOne({name: 'default'}, function (err, playlist) {
    if (err) return events.emit('error', err)
    if (!playlist) return events.emit('error', {message: 'no default'})

    play(playlist)
  })
}


module.exports = {
  events: events,
  play: play,
  initialize: initialize
}
