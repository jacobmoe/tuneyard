var _ = require('lodash')

var Playlist = require('../models/playlist')
var events = new (require('events').EventEmitter)()

var timeouts = {}

function scheduleNext(playlist) {
  var currentTrack = playlist.tracks[playlist.currentTrackIndex]

  var nextIndex = playlist.currentTrackIndex + 1

  timeouts[playlist.id] = setTimeout(function () {
    Playlist.findOne({_id: playlist.id}, function (err, playlist) {
      if (nextIndex > playlist.tracks.length - 1) nextIndex = 0

      var track = playlist.tracks[nextIndex]

      playlist.currentTrackIndex = nextIndex
      playlist.startTime = Date.now()

      playlist.save(function (err) {
        console.log('play next track', err, track)

        var data = track.toJSON()
        data.index = nextIndex
        events.emit('newCurrentTrack', {
          track: data,
          playlistName: playlist.name
        })

        scheduleNext(playlist)
      })
    })
  }, currentTrack.length * 1000)
}

function play(playlist) {
  if (playlist.currentTrackIndex) {
    if (playlist.currentTrackIndex >= playlist.tracks.length)
      playlist.currentTrackIndex = 0

    track = playlist.tracks[playlist.currentTrackIndex]
  } else {
    track = playlist.tracks[0]
    playlist.currentTrackIndex = 0
  }

  if (!track) {
    var errMessage = playlist.name + ' playlist is empty'
    return events.emit('error', {message: errMessage})
  }

  playlist.startTime = Date.now()

  playlist.save(function (err) {
    var data = track.toJSON()
    data.index = playlist.currentTrackIndex
    
    events.emit('newCurrentTrack', {
      track: data,
      playlistName: playlist.name
    })

    scheduleNext(playlist)
  })
}

function stop(playlist) {
  if (!playlist) {
    Object.keys(timeouts).forEach(function (key) {
      clearTimeout(timeouts[key])
    })
  } else {
    clearTimeout(timeouts[playlist.id])
  }
}

function initialize(io) {
  events.on('newCurrentTrack', function (data) {
    io.to(data.playlistName).emit('tracks:startNew', data.track)
  })

  events.on('error', function (err) {
    io.sockets.emit('playlists:error', err)
  })
  
  Playlist.find({}, function (err, playlists) {
    if (err) return events.emit('error', err)
    if (!playlists.length || playlists.length === 0)
      return events.emit('error', {message: 'no playlists'})

    playlists.forEach(function (playlist) {
      play(playlist)
    })
  })
}


module.exports = {
  events: events,
  play: play,
  stop: stop,
  initialize: initialize
}
