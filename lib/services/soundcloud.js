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
  
  console.log("get url =========>", opts.url)

  request(opts, function (err, res, body) {
    if (err) cb(err)
    
    
    cb(null, JSON.parse(body))
  })
}

function getTrackData(trackId, cb) {
  get('/tracks/' + trackId, function (err, data) {
    if (err) return cb(err)

    cb(null, data)
  })
}

function getTrackId(url, cb) {
  get('resolve', {url: url}, function(err, data) {
    if (err) return cb(err)

    console.log("app ======>", data.id)

    cb(null, data)
  })
}

module.exports = {
  getTrackData: getTrackData,
  getTrackId: getTrackId
}
