#!/usr/bin/env node

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

var Playlist = require('../lib/models/playlist')
var Source = require('../lib/models/source')
var prompt = require('prompt')
var db = require('../lib/db')

var schema = {
  properties: {
    'type': {
      required: true,
      default: 'rss',
      pattern: /(rss|reddit)/
    },
    'name': {
      required: true
    },
    'url': {
      required: true
    },
    'originUrl': {
      required: true
    }
  }
}

function createSource(result, cb) {
  Playlist.findOne({name: 'default'}, function (err, pl) {
    Source.create(result, function (err, source) {
      if (err) {
        console.log("error creating source", err)
        cb()
      } else {
        pl.sources.push(source.id)
        pl.save(function (err) {
          if (err) {
            console.log("error adding source to playlist", err)
          } else {
            console.log("source added to playlist")
          }

          cb()
        })
      }
    })
  })
}

prompt.get(schema, function (err, result) {
  db.connect(function () {
    createSource(result, process.exit)
  })
})

prompt.start()
