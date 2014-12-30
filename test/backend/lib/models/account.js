var Account = require('../../../../lib/models/account')

describe('Model: Account', function () {

  describe('validations', function () {
    it('requires email, hash and salt', function (done) {
      Account.create({}, function (err, account) {
        assert.ok(err)
        assert.notOk(account)
        assert.equal('ValidatorError', err.errors.email.name)
        assert.equal('ValidatorError', err.errors.hash.name)
        assert.equal('ValidatorError', err.errors.salt.name)
        done()
      })
    })
  })

  describe('methods', function () {

    describe('validPassword', function () {

      it('compares given password with actual password', function (done) {
        var params = {
          email: 'test@example.com',
          password: 'thepassword'
        }

        Account.create({email: 'test@example.com'}, function (err, account) {
          console.log("====>", err, account)
          done()
        })
      })

    })

  })

})
