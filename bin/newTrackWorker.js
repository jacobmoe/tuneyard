#!/usr/bin/env node

var request = require('request')
  , prompt = require('prompt')
  , _ = require('lodash')

var Playlist = require('../lib/models/playlist')
  , db = require('../lib/db')

var url = 'http://www.reddit.com/r/indieheads.json'

function fetchTracks(playlist, cb) {
  var jobs = []

  request(url, function (err, res, body) {
    if (err || !body) return cb()
    
    var data = JSON.parse(body).data

    _.forEach(data.children, function (post) {
      console.log("======>", post.data.domain)
    })

    cb()
  })
}

db.connect(function () {
  Playlist.findOne({name: 'new'}, function (err, playlist) {
    fetchTracks(playlist, process.exit)
  })
})
