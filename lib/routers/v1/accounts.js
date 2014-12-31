var router = require('express').Router()

var Account = require('../../models/account')

router.route('/')
.get(function (req, res, next) {
  Account.find({}, function (err, result) {
    if (err) return res.status(400).send(err)

    res.json(result)
  })
})
.post(function (req, res, next) {

})

module.exports = router
