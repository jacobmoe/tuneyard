var _ = require('lodash')
  , request = require('request')

function index(req, res, next) {
  res.json(req.playlist.sources)
}

function show(req, res, next) {
  res.json(req.playlist.sources[req.params.id])
}

function create(req, res, next) {
  var source = req.body

  if (source.type === 'reddit') {
    var options = {
      url: req.body.url,
      maxRedirects: 3,
      timeout: 5000,
      method: 'HEAD'
    }

    request(options, function(err, headResponse) {
      if (err) return res.status(500).send(err)
      
      var status = headResponse.statusCode
      var header = headResponse.headers['content-type']

     if (status == 200 && header.match(/^application\/json.*/)) {
        req.playlist.sources.push(req.body)

        req.playlist.save(function (err) {
          if (err) return res.status(400).send(err)

          res.json(source)
        })
      } else {
        res.status(400).send({message: 'Subreddit not found'})
      }
    })
  } else {
    res.status(415).send({message: 'Unsupported source'})
  }
}

function destroy(req, res, next) {
  req.playlist.sources.splice(req.params.id, 1)

  req.playlist.save(function(err) {
    if (err) res.status(500).send(err)
    else res.status(204).send({})
  })
}

module.exports = {
  index: index,
  show: show,
  create: create,
  destroy: destroy
}
