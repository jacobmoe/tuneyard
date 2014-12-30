var Account = require('../../../../lib/models/account')

describe('Model: Account', function () {

  before(connectDb)

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
        var account = new Account({email: 'test@example.com'})
        account.setPassword('thepassword', 'thepassword', function (err) {
          account.save(function () {
            console.log("------------", err)
            done()
          })
        })
      })

    })

  })

})
