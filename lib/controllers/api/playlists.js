function show(req, res, next) {
  res.json(req.playlist)
}

module.exports = {
  show: show
}
