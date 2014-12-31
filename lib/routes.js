module.exports = function(app) {
  app.use('/api', require('./routers/api'))

  app.get('/', function(req, res) {
  	res.render('index')
  })

  app.all("/*", function(req, res) {
    return res.redirect('/')
  })
}
