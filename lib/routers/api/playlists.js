var router = require('express').Router()

router.use('/:playlistId/tracks', require('./playlists/tracks'))

module.exports = router
