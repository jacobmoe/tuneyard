var router = require('express').Router({mergeParams: true})

var controller = require('../../../controllers/api/playlists/tracks')
var factory = require('./factory')

factory({router: router, controller: controller})

module.exports = router
