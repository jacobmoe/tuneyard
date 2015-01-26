#!/usr/bin/env node

var request = require('request')
  , _ = require('lodash')
  , async = require('async')
  , moment = require('moment')

var Playlist = require('../lib/models/playlist')
  , db = require('../lib/db')

var expiryTimes = {
  tracks: {amount: '2', unit: 'weeks'},
  dropped: {amount: '4', unit: 'weeks'}
}

function removeExpired (playlist, collectionName) {
  var toRemove = []

  var expiryTime = expiryTimes[collectionName]

  var expiryLimit = moment().subtract(expiryTime.amount, expiryTime.unit)

  for (var i = 0; i < playlist[collectionName].length; i++) {
    var track = playlist[collectionName][i]

    if (expiryLimit.isAfter(track.createdAt)) {
      console.log("remove track from " + collectionName, track.originId)
      toRemove.push(track._id)
    }
  }

  toRemove.forEach(function (id) {
    playlist[collectionName].id(id).remove()
  })
}

function servicePlaylist(playlist, done) {
  if (playlist.dropped)
    removeExpired(playlist, 'dropped')

  if (playlist.name === 'default') {
    removeExpired(playlist, 'tracks')

    playlist.tracks = _.shuffle(playlist.tracks)
  }

  playlist.save(done)
}

db.connect(function () {
  console.log("##### playlist maintenance", new Date(), "#####")

  var jobs = []

  Playlist.find({}, function (err, playlists) {
    _.forEach(playlists, function (playlist) {
      jobs.push(function (cb) {
        servicePlaylist(playlist, cb)
      })
    })

    async.parallel(jobs, process.exit)
  })

})
