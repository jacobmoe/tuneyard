#!/usr/bin/env node

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

var Playlist = require('../lib/models/playlist')
var prompt = require('prompt')
var db = require('../lib/db')

var schema = {
  properties: {
    'name': {
      required: true,
      default: 'default'
    }
  }
}

function createPlaylist(result, cb) {
  Playlist.create(result, function (err, pl) {
    if (err) console.log("Error creating playlist:", err)
    else console.log('Created playlist')

    process.exit()
  })
}

prompt.get(schema, function (err, result) {
  db.connect(function () {
    createPlaylist(result)
  })
})

prompt.start()

