var youtube = require('../../../services/youtube')

function index(req, res, next) {
  res.json(req.resources)
}

function show(req, res, next) {
  res.json(req.resource)
}

function save(req, res, next) {
  req.resource.set(req.body).save(function(err, resource) {

    if (err) {
      res.status(400).send(err)
    } else {
      res.json(resource)
    }
  })
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
      console.log('new track added: ', err, track)

      if (err) return socket.emit('tracks:new:error', err)

      io.sockets.emit('tracks:new', params)
    })

  })
}

function destroy(req, res, next) {
  req.resource.destroy(function(err) {
    if (err) {
      res.status(500).send(err)
    } else {
      res.status(204).send({})
    }
  })
}

module.exports = {
  index: index,
  show: show,
  save: save,
  create: create,
  destroy: destroy
}
