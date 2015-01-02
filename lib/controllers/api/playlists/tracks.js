var _ = require('lodash')

var youtube = require('../../../services/youtube')

function index(req, res, next) {
  res.json(req.playlist.tracks)
}

function show(req, res, next) {
  res.json(req.playlist.tracks[req.params.id])
}

function create(req, res, next) {
  var service

  var sourceId = req.body.sourceId
  var source = req.body.source
  
  if (source === 'Youtube') service = youtube
  else return res.status(501).send('source ' + source + ' not supported')

  service.getVideoData(sourceId, function (err, data) {
    if (err) return res.status(401).send(err)

    var params = _.merge(req.body, data)

    req.playlist.insertTrack(params)

    req.playlist.save(function (err) {
      if (err) return res.status(401).send(err)

      res.json({message: 'new track added to playlist'})
    })
  })
}

function destroy(req, res, next) {
  req.playlist.tracks.splice(req.params.id, 1)

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
