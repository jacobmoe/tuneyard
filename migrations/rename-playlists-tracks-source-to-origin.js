db.playlists.find().forEach(function(playlist) {
  var set = {}, unset = {}
  playlist.tracks.forEach(function (track, index) {
    var source = track.source
    var sourceId = track.sourceId

    set['tracks.' + index + '.origin'] = source
    set['tracks.' + index + '.originId'] = sourceId

    unset['tracks.' + index + '.source'] = 1
    unset['tracks.' + index + '.sourceId'] = 1
  })

  if (playlist.dropped) {
    playlist.dropped.forEach(function (droppedTrack, index) {
      var source = droppedTrack.source
      var sourceId = droppedTrack.sourceId

      set['dropped.' + index + '.origin'] = source
      set['dropped.' + index + '.originId'] = sourceId

      unset['dropped.' + index + '.source'] = 1
      unset['dropped.' + index + '.sourceId'] = 1
    })
  }

  db.playlists.update(playlist, {$set: set, $unset: unset})
})
