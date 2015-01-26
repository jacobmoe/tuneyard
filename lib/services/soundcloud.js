var config = require('config').get('apiKeys.soundcloud')
  , request = require('request')

var base = 'https://api.soundcloud.com/'

function get(endpoint, params, cb) {
  var opts = {
    url: base + endpoint + '?client_id=' + config.clientId
  }

  if (params) {
    var queryString = ''

    Object.keys(params).forEach(function (key) {
      queryString = queryString + '&' + key + '=' + params[key]
    })

    opts.url += queryString
  }

  request(opts, function (err, res, body) {
    if (err) return cb(err)
    if (!body) return cb({message: 'no body returned with response'})

    cb(null, JSON.parse(body))
  })
}

/*
 * Accepts a soundcloud track URL or a track ID
 * returns a track data object
*/
function getTrackData(id, cb) {
  var endpoint, data = {}

  if (isSoundcloudUrl(id)) {
    endpoint = 'resolve'
    data = { url: id }
  } else {
    endpoint = 'tracks/' + id + '.json'
  }

  get(endpoint, data, function(err, data) {
    if (err) return cb(err)

    if (!data.streamable) return cb({message: 'track is not streamable'})

    var user = data.user || {}

    var params = {
      originId: data.id,
      title: data.title,
      length: (data.duration / 1000),
      artist: user.username
    }

    cb(null, params)
  })
}

function isSoundcloudUrl(url) {
  var regexp = /^https?:\/\/soundcloud.com\/([\w-]*)\/([\w-]*)$/
  return !!url.match(regexp)
}

function trackIdFromEmbedUrl(url) {
  var regexp = /^https?:\/\/w.soundcloud.com\/player\/\?url=https(?::|%3A)\/\/api.soundcloud.com\/tracks\/([0-9]*).*/

  var matches = url.match(regexp)

  if (matches) return matches[1]
}

module.exports = {
  getTrackData: getTrackData,
  isSoundcloudUrl: isSoundcloudUrl,
  trackIdFromEmbedUrl: trackIdFromEmbedUrl
}
