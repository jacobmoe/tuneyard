#!/usr/bin/env node

var FeedParser = require('feedparser')
  , request = require('request')
  , async = require('async')
  , HtmlParser2 = require('htmlparser2')
  , _ = require('lodash')

var db = require('../lib/db')
  , youtube = require('../lib/services/youtube')
  , soundcloud = require('../lib/services/soundcloud')
  , Playlist = require('../lib/models/playlist')
  , Source = require('../lib/models/source')

var feeds = {
  'http://www.obscuresound.com': 'http://feeds.feedburner.com/ObscureSound',
  'http://www.gorillavsbear.net': 'http://feeds.feedburner.com/GVSB',
  'http://www.hearya.com': 'http://feeds.feedburner.com/Hearya',
  'http://diary.welikeitindie.com': 'http://feeds.feedburner.com/welikeitindie',
  'http://blog.iso50.com': 'http://blog.iso50.com/feed/',
  'http://adhoc.fm': 'http://adhoc.fm/feed/',
  'http://www.indieshuffle.com': 'http://feeds.feedburner.com/indieshuffle/',
  'http://pitchfork.com': 'http://pitchfork.com/rss/reviews/best/tracks/'
}

function hydrateYoutubeTrack(data, cb) {
  youtube.getTrackData(data.originId, function (err, videoData) {
    if (err) return cb()

    var track = {
      title: videoData.title,
      origin: 'Youtube',
      originId: data.originId,
      length: videoData.length,
      source: data.source
    }

    cb(null, track)
  })
}

function hydrateSoundcloudTrack(data, cb) {
  soundcloud.getTrackData(data.originId, function (err, result) {
    if (err) return cb()

    result.origin = 'Soundcloud'
    result.source = data.source

    cb(null, result)
  })
}

function hydrateTracks(trackData, done) {
  var jobs = []

  trackData.forEach(function (data) {
    if (data.origin === 'Youtube') {
      jobs.push(function (cb) {
        hydrateYoutubeTrack(data, cb)
      })
    } else if (data.origin === 'Soundcloud') {
      jobs.push(function (cb) {
        hydrateSoundcloudTrack(data, cb)
      })
    }
  })

  async.series(jobs, function (err, results) {
    done(err, results)
  })
}

function buildTrackOriginData(url, tracks) {
  var originData

  var soundcloudTrackId = soundcloud.trackIdFromEmbedUrl(url)

  if (soundcloudTrackId) {
    originData = {origin: 'Soundcloud', originId: soundcloudTrackId}
  } else if (soundcloud.isSoundcloudUrl(url)) {
    originData = {origin: 'Soundcloud', originId: url}
  } else {
    var id = youtube.videoIdFromUrl(url)

    if (!id) return

    originData = {origin: 'Youtube', originId: id}
  }

  if (_.some(tracks, originData)) return

  return originData
}

function scrapeFeed(source, done) {
  var tracks = []

  var req = request(source.url)
    , feedparser = new FeedParser()

  var htmlparser = new HtmlParser2.Parser({
    onopentag: function(name, attribs) {
      var data

      if (name === 'a') {
        data = buildTrackOriginData(attribs.href, tracks)
      } else if (name === 'iframe') {
        data = buildTrackOriginData(attribs.src, tracks)
      }

      if (data) {
        data.source = source.id
        tracks.push(data)
      }
    }
  }, {decodeEntities: true})

  req.on('error', function (error) {
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
    hydrateTracks(tracks, function (err, results) {
      done(err, _.compact(results))
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
  console.log("##### rss", new Date(), "#####")

  var jobs = []

  Playlist.findOne({name: 'default'}, function (err, playlist) {
    Source.find({_id: {$in: playlist.sources}}, function (err, allSources) {
      var sources = _.filter(allSources, {type: 'rss'})

      sources.forEach(function (source) {
        jobs.push(function (cb) {
          scrapeFeed(source, cb)
        })
      })

      async.parallel(jobs, function (err, tracks) {
        if (err || !tracks) return process.exit()

        tracks = _.flatten(tracks)
        tracks = _.compact(tracks)

        var newTracks = _.filter(tracks, function (track) {
          var id = track.originId.toString()
          var data = {origin: track.origin, originId: id}

          var shouldAdd = !_.some(playlist.tracks, data) &&
                          !_.some(playlist.dropped, data)

          if (shouldAdd)
            console.log('adding', track.origin, 'track', track.title)

          return shouldAdd
        })

        newTracks = _.shuffle(newTracks)

        addAllTracks(playlist, newTracks, process.exit)
      })
    })
  })
})
