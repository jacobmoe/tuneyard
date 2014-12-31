var router = require('express').Router()

router.use('/accounts', require('./api/accounts'))
router.use('/sessions', require('./api/sessions'))

module.exports = router
