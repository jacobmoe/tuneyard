#!/usr/bin/env node

var request = require('request')
  , prompt = require('prompt')
  , _ = require('lodash')
  , async = require('async')

var Playlist = require('../lib/models/playlist')
  , db = require('../lib/db')
  , youtube = require('../lib/services/youtube')
  , count = 0

var domain = 'http://www.reddit.com'

// http://www.reddit.com/r/Music/wiki/musicsubreddits

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

function trackInPlaylist(playlist, vidId) {
  return _.some(playlist.tracks, {sourceId: vidId})
}

function buildTrack(playlist, data, cb) {
  var vidId = youtube.videoIdFromUrl(data.url)

  if (!vidId) return cb()

  if (trackInPlaylist(playlist, vidId)) return cb()

  youtube.getVideoData(vidId, function (err, videoData) {
    if (err) return cb()

    console.log('found new track:', videoData.title)

    var track = {
      title: videoData.title,
      source: 'Youtube',
      sourceId: vidId,
      length: videoData.length
    }
    
    cb(null, track)
  })

}

function fetchTracks(playlist, url, done) {
  var jobs = []

  request(url, function (err, res, body) {
    if (err || !body) return cb()

    var data = JSON.parse(body).data

    _.forEach(data.children, function (post) {
      var data = post.data || {}
      var media = data.media || {}

      if (data.domain === 'youtube.com') {
        var oembed = media.oembed || {}

        if (oembed.title && oembed.url) {
          jobs.push(function (cb) {
            var trackData = { title:  oembed.title, url: oembed.url }
            buildTrack(playlist, trackData, cb)
          })
        }
      }
    })

    async.series(jobs, function (err, tracks) {
      done(null, tracks)
    })
  })
}

function addAllTracks (playlist, tracks, done) {
  tracks.forEach(function (track) {
    playlist.insertTrack(track)
  })
  
  console.log("saving playlist")
  playlist.save(done)
}

db.connect(function () {
  var jobs = []

  Playlist.findOne({name: 'default'}, function (err, playlist) {
    _.forEach(subs, function (sub) {
      var url = domain + '/r/' + sub + '.json?limit=100'

      jobs.push(function (cb) {
        fetchTracks(playlist, url, cb)
      })

    })

    async.series(jobs, function (err, allTracks) {
      var tracks = _.flatten(allTracks)
      
      tracks = _.shuffle(tracks)
      addAllTracks(playlist, tracks, process.exit)
    })
  })
})
