module.exports = function(schema, name) {
  var key = '_' + name

  schema.virtual(name).get(function() {
    return this[key]
  }).set(function(val) {
    this[key] = val
  })
}
