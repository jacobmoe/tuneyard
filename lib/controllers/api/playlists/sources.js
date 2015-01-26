var _ = require('lodash')
  , request = require('request')

var Source = require('../../../models/source')

function index(req, res, next) {
  Source.find({_id: {$in: req.playlist.sources}}, function (err, sources) {
    if (err) return res.status(500).send(err)

    res.json(sources)
  })
}

function show(req, res, next) {
  var id = req.playlist.sources[req.params.id]

  Source.findOne({_id: id}, function (err, source) {
    if (err) return res.status(500).send(err)

    res.json(source)
  })
}

function create(req, res, next) {
  var body = req.body || {}

  Source.findOne(body, function (err, source) {
    if (source) {
      req.playlist.sources.push(source.id)
      req.playlist.save(function () {
        res.json(source)
      })
    } else {
      if (body.type === 'reddit') {
        var options = {
          url: body.url,
          maxRedirects: 3,
          timeout: 5000,
          method: 'HEAD'
        }

        request(options, function(err, headResponse) {
          if (err) return res.status(500).send(err)

          var status = headResponse.statusCode
          var header = headResponse.headers['content-type']

          if (status == 200 && header.match(/^application\/json.*/)) {
            Source.create(body, function (err, source) {
              if (err) return res.status(400).send(err)

              req.playlist.sources.push(source.id)

              req.playlist.save(function (err) {
                if (err) return res.status(400).send(err)

                res.json(source)
              })
            })
          } else {
            res.status(400).send({message: 'Subreddit not found'})
          }
        })
      } else {
        res.status(415).send({message: 'Unsupported source'})
      }
    }
  })
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
