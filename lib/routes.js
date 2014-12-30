module.exports = function(app) {
  app.use('/v1', require('./routers/v1'))
}
