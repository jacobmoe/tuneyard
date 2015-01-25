#!/usr/bin/env node

var request = require('request')
  , _ = require('lodash')
  , async = require('async')

var Playlist = require('../lib/models/playlist')
  , db = require('../lib/db')
  , youtube = require('../lib/services/youtube')
  , soundcloud = require('../lib/services/soundcloud')

var domain = 'http://www.reddit.com'

// http://www.reddit.com/r/Music/wiki/musicsubreddits
// subs are now stored in db.
var subs = [
  'indieheads',
  'indie',
  'indiefolk',
  'folkrock',
  'altcountry',
  'indie_rock',
  'indiewok',
  'flocked',
  'folk'
]

function trackInPlaylist(playlist, data) {
  var dropped = playlist.dropped || []

  return _.some(playlist.tracks, data) || _.some(dropped, data)
}

function buildYoutubeTrack(playlist, data, cb) {
  var vidId = youtube.videoIdFromUrl(data.url)

  if (!vidId) return cb()

  var criteria = {origin: 'Youtube', originId: vidId}
  if (trackInPlaylist(playlist, criteria)) {
    return cb()
  }

  youtube.getTrackData(vidId, function (err, videoData) {
    if (err) return cb()

    console.log('adding new youtube track:', videoData.title)

    var track = {
      title: videoData.title,
      origin: 'Youtube',
      originId: vidId,
      length: videoData.length
    }

    cb(null, track)
  })
}

function buildSoundcloudTrack(playlist, data, cb) {
  soundcloud.getTrackData(data.url, function (err, data) {
    if (err) return cb()

    var criteria = {
      origin: 'Soundcloud',
      originId: data.originId.toString()
    }

    if (trackInPlaylist(playlist, criteria)) {
      return cb()
    }

    console.log('adding new soundcloud track:', data.title)

    data.origin = 'Soundcloud'

    cb(null, data)
  })
}

function fetchTracks(playlist, url, done) {
  var jobs = []

  request(url, function (err, res, body) {
    if (err || !body) {
      console.log("fetchTracks request error:", err)
      return done()
    }

    var data = JSON.parse(body).data

    _.forEach(data.children, function (post) {
      var data = post.data || {}

      if (data.title && data.url) {
        if (data.domain === 'youtube.com') {
          jobs.push(function (cb) {
            buildYoutubeTrack(playlist, data, cb)
          })
        } else if (data.domain === 'soundcloud.com') {
          jobs.push(function (cb) {
            buildSoundcloudTrack(playlist, data, cb)
          })
        }

      }
    })

    async.series(jobs, function (err, tracks) {
      if (err) {
        console.log("fetach all tracks error:", err)
      }

      done(null, tracks)
    })
  })
}

function addAllTracks (playlist, tracks, done) {
  tracks.forEach(function (track) {
    playlist.insertTrack(track)
  })

  console.log("saving", tracks.length, "tracks to to playlist")
  playlist.save(done)
}

db.connect(function () {
  console.log("#### check for new tracks", new Date(), "####")

  var jobs = []

  Playlist.findOne({name: 'default'}, function (err, playlist) {
    var sources = _.filter(playlist.sources, {type: 'reddit'})
    _.forEach(sources, function (source) {

      jobs.push(function (cb) {
        console.log("adding tracks from subreddit:", source.name)
        fetchTracks(playlist, source.url, cb)
      })
    })

    async.series(jobs, function (err, allTracks) {
      if (err) {
        console.log("all tracks from all playlists err:", err)
      }

      var tracks = _.flatten(allTracks)

      tracks = _.compact(tracks)
      tracks = _.shuffle(tracks)

      addAllTracks(playlist, tracks, process.exit)
    })
  })
})
