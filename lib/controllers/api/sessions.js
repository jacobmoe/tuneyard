module.exports = {
  create: function(req, res, next) {
    res.json(req.user)
  },

  show: function (req, res, next) {
    if (req.user) {
      res.json(req.user)
    } else {
      res.status(404).json({message: "user not found"})
    }
  },

  delete: function (req, res, next) {
    req.logout()
    res.json({message: "Successfully logged out"})
  }

}
