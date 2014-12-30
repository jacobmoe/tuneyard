var router = require('express').Router()

var Account = require('../../models/account')

router.route('/')
.get(function (req, res, next) {
  res.send('hello')
})

module.exports = router
