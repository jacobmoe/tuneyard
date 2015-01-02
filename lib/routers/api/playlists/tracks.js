var router = require('express').Router({mergeParams: true})

var Playlist = require('../../../models/playlist')
  , controller = require('../../../controllers/api/playlists/tracks')

router.route('/')
.all(function (req, res, next) {
  var playlistId = req.params.playlistId

  Playlist.findOne({id: playlistId}, function (err, playlist) {
    if (err) {
      res.status(401).send(err)
    } else if (!playlist) {
      res.status(404).send('playlist not found')
    } else {
      req.playlist = playlist
      next()
    }
  })
})
.get(function (req, res, next) {
  req.resources = req.playlist.tracks
  next()
})
.get(controller.index)
.post(controller.create)

router.route('/:id')
.all(function(req, res, next) {

  Playlist.find({id: req.params.id}, function (err, resource) {
    if (err)
      return res.status(404).send({})

    req.resource = resource
    next()
  })
})
.get(controller.show)
.put(controller.save)
.delete(controller.destroy)



module.exports = router
