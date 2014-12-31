var router = require('express').Router()
  , passport = require('passport')

var controller = require('../../controllers/api/sessions')

router.route('/')
  .post(passport.authenticate('local'))
  .post(controller.create)

router.route('/')
  .get(controller.show)

router.route('/')
  .delete(controller.delete)

module.exports = router
