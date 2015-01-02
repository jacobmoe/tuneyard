var router = require('express').Router()

router.use('/accounts', require('./api/accounts'))
router.use('/sessions', require('./api/sessions'))
router.use('/playlists', require('./api/playlists'))

module.exports = router
