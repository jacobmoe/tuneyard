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

  db.playlists.update(playlist, {$set: set, $unset: unset})
})
