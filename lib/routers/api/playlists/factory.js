var router = require('express').Router({mergeParams: true})

var Playlist = require('../../../models/playlist')

module.exports = function (opts) {
  controller = opts.controller
  router = opts.router || router

  router.route('/')
  .all(function (req, res, next) {
    var name = req.params.name

    Playlist.findOne({name: name}, function (err, playlist) {
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
  .get(controller.index)
  .post(function (req, res, next) {
    if (req.user) next()
    else return res.status(403).json({message: 'must be logged in'})
  })
  .post(controller.create)

  router.route('/:id')
  .all(function(req, res, next) {
    Playlist.findOne({name: req.params.name}, function (err, playlist) {
      if (err) return res.status(404).send({})
      if (!playlist) return res.status(404).json({message: 'no playlist found'})

      req.playlist = playlist
      next()
    })
  })
  .get(controller.show)
  .delete(function (req, res, next) {
    if (req.user) next()
    else return res.status(403).json({message: 'must be logged in'})
  })
  .delete(controller.destroy)
}


