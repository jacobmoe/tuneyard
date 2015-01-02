var events = new (require('events').EventEmitter)()

function scheduleNext(playlist) {
  var nextIndex = playlist.currentTrackIndex + 1
  if (nextIndex >= playlist.tracks.length - 1) nextIndex = 0

  var track = playlist.tracks[nextIndex]

  setTimeout(function () {
    playlist.currentTrackIndex = nextIndex

    playlist.save(function (err) {
      events.emit('newCurrentTrack', track)

      scheduleNext(playlist)
    })
  }, track.length * 1000)
}

module.exports = {
  events: events,

  play: function (playlist) {
    if (playlist.currentTrackIndex) {
      track = playlist.tracks[currentTrackIndex]
    } else {
      track = playlist.tracks[0]
      playlist.currentTrackIndex = 0
    }

    if (!track)
      return events.emit('error', {message: 'default playlist is empty'})

    playlist.save(function (err) {
      events.emit('newCurrentTrack', track)

      scheduleNext(playlist)
    })
  }

}
