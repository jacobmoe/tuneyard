module.exports = function(schema) {
  schema.add({
    createdAt: { type: Date, default: Date.now }
  })


  schema.plugin(require('./attrAccessor'), 'skipUpdatedAt')

  schema.pre('save', function(next) {
    if (!this.skipUpdatedAt) {
      this.updatedAt = new Date()
    }
    next()
  })
}
