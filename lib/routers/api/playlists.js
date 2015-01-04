var router = require('express').Router()

router.use('/:name/tracks', require('./playlists/tracks'))

module.exports = router
