function show(req, res, next) {
  var data = req.playlist
  
  if (req.query.truncated)
    data.tracks = null

  res.json(data)
}

module.exports = {
  show: show
}
