var User = require('../../../../lib/models/user')

describe('Model: User', function () {

  describe('validations', function () {
    it('requires email, username, hash and salt', function (done) {
      User.create({}, function (err, user) {
        assert.ok(err)
        assert.notOk(user)
        assert.equal('ValidatorError', err.errors.email.name)
        assert.equal('ValidatorError', err.errors.username.name)
        assert.equal('ValidatorError', err.errors.hash.name)
        assert.equal('ValidatorError', err.errors.salt.name)
        done()
      })
    })
  })

})
