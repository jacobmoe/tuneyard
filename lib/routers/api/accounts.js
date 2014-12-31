var router = require('express').Router()
  , passport = require('passport')

var Account = require('../../models/account')

router.route('/')
.get(function (req, res, next) {
  if (!req.user)
    return res.status(403).send({message: 'must be logged in'})

  var criteria = req.query || {}

  Account.find(criteria, function (err, result) {
    if (err) return res.status(400).send(err)

    res.json(result)
  })
})

module.exports = router
