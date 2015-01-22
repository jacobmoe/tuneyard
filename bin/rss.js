#!/usr/bin/env node

var FeedParser = require('feedparser')
  , request = require('request')
  , async = require('async')
  , HtmlParser2 = require('htmlparser2')
  , _ = require('lodash')

var db = require('../lib/db')
  , youtube = require('../lib/services/youtube')
  , soundcloud = require('../lib/services/soundcloud')

var feeds = {
  ObscureSound: 'http://feeds.feedburner.com/ObscureSound'
}

function hydrateYoutubeTrack(data, cb) {
  // return a track
}

function hydrateSoundcloudTrack(data, cb) {
  // return a track
}

function hydrateTracks(trackData, done) {
  var jobs = []
  
  trackData.forEach(function (data) {
    if (data.source === 'Youtube') {
      jobs.push(function (cb) {
        hydrateYoutubeTrack(data, cb)
      })
    } else if (data.source === 'Soundcloud') {
      jobs.push(function (cb) {
        hydrateSoundcloudTrack(data, cb)
      })
    }
  })
  
  async.series(jobs, done)
}

function buildTrackSourceData(url, tracks) {
  var sourceData

  if (soundcloud.isSoundcloudUrl(url)) {
    sourceData = {source: 'Soundcloud', souceId: url}

    if (_.some(tracks, sourceData)) return

    return sourceData
  } else {
    var id = youtube.videoIdFromUrl(url)

    if (!id) return
    
    sourceData = {source: 'Youtube', souceId: id}

    if (_.some(tracks, sourceData)) return

    return sourceData
  }
}

function scrapeFeed(url, done) {
  var tracks = []

  var req = request(url)
    , feedparser = new FeedParser()

  var htmlparser = new HtmlParser2.Parser({
    onopentag: function(name, attribs) {
      var data

      if (name === 'a') {
        data = buildTrackSourceData(attribs.href)
      } else if (name === 'iframe') {
        data = buildTrackSourceData(attribs.src)
      }

      if (data) tracks.push(data)
    }
  }) //, {decodeEntities: true})

  req.on('error', function (error) {
    console.log("request error ==>", error)
    done()
  })

  req.on('response', function (res) {
    var stream = this

    if (res.statusCode != 200)
      return this.emit('error', new Error('bad response'))

    stream.pipe(feedparser)
  })

  feedparser.on('error', function(error) {
    console.log("feedparser error ==>", error)
    done()
  })

  feedparser.on('readable', function() {
    var stream = this
      , meta = this.meta
      , item

    while (item = stream.read()) {
      htmlparser.write(item.description)
      htmlparser.end()
    }
  })

  feedparser.on('end', function () {
    hydrateTracks(tracks, done)
  })
}

db.connect(function () {
  console.log("##### rss", new Date(), "#####")
  
  var jobs = []

  Object.keys(feeds).forEach(function (key) {
    jobs.push(function (cb) {
      scrapeFeed(feeds[key], cb)
    })
  })

  async.parallel(jobs, function (err, tracks) {
    // tracks should be all "hydrated" tracks. 
    // check each track against existing tracks in the playlist
    // shuffle them and add remaining to the default playlist
  })
})
