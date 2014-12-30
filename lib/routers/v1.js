var router = require('express').Router()

router.use('/accounts', require('./v1/accounts'))

module.exports = router
