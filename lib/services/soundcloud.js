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
    
    cb(null, JSON.parse(body))
  })
}

function getTrackData(url, cb) {
  get('resolve', {url: url}, function(err, data) {
    if (err) return cb(err)

    var params = {
      sourceId: data.id,
      title: data.title,
      length: (data.duration / 1000)
    }

    cb(null, params)
  })
}

function isSoundcloudUrl(url) {
  var regexp = /^https?:\/\/soundcloud.com\/([\w-]*)\/([\w-]*)$/
  return !!url.match(regexp)
}

module.exports = {
  getTrackData: getTrackData,
  isSoundcloudUrl: isSoundcloudUrl
}
