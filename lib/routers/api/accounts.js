var router = require('express').Router()

var Account = require('../../models/account')

router.route('/')
.get(function (req, res, next) {
  var criteria = req.query || {}

  Account.find(criteria, function (err, result) {
    if (err) return res.status(400).send(err)

    res.json(result)
  })
})

module.exports = router
