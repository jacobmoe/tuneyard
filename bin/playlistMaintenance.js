#!/usr/bin/env node

var request = require('request')
  , _ = require('lodash')
  , async = require('async')
  , moment = require('moment')

var Playlist = require('../lib/models/playlist')
  , db = require('../lib/db')

var droppedExpiryTime = {amount: '1', unit: 'week'}

function removeExpiredDropped (playlist, callback) {
  var toRemove = []
  
  var droppedLimit = moment().subtract(
    droppedExpiryTime.amount,
    droppedExpiryTime.unit
  )
  
  for (var i = 0; i < playlist.dropped.length; i++) {
    var track = playlist.dropped[i]

    if (droppedLimit.isAfter(track.createdAt)) {
      console.log("remove track from dropped list", track.sourceId)
      toRemove.push(track._id)
    }
  }
  
  toRemove.forEach(function (id) {
    playlist.dropped.id(id).remove()
  })
  
  playlist.save(callback)

}

function servicePlaylist(playlist, done) {
  if (playlist.dropped) {
    removeExpiredDropped(playlist, function () {
      done()
    })
  } else {
    done()
  }
}

db.connect(function () {
  console.log("#### playlist maintenance", new Date(), "####")

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
