var router = require('express').Router()
var controller = require('../../controllers/api/playlists')
var Playlist = require('../../models/playlist')

router.use('/:name/tracks', require('./playlists/tracks'))
router.use('/:name/sources', require('./playlists/sources'))

router.route('/:id')
.get(function (req, res, next) {
  var name = req.params.id
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
.get(controller.show)

module.exports = router
