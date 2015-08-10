/*
 * playlist track schemas had source and sourceId fields
 * source may be "Youtube" or "Soundcloud" with sourceId being the id of the track
 * it got confusing with a "source" also pointing to an rss feed or a subreddit
 * this renames source and sourceId fields to origin and originId
 * in tracks and dropped subschemas
 *
 * meant to be run once but can serve as a template
 * for renaming fields in subschemas. run directly in the mongo console
 */

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
