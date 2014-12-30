var bcrypt = require('bcrypt')

var Account = require('../../../../lib/models/account')

describe('Model: Account', function () {

  before(connectDb)
  beforeEach(clearCollections)

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

  describe('#setPassword', function () {
    var password = 'test@example.com'

    it('encrypts and sets the password', function (done) {
      var account = new Account({email: 'test@example.com'})
      account.setPassword(password, password, function (err) {
        assert.isNull(err)

        assert.ok(account.hash)
        assert.ok(account.salt)

        assert.notEqual(password, account.hash)

        bcrypt.compare(password, account.hash, function(err, res) {
          assert.notOk(err)
          assert.isTrue(res)
          done()
        })

      })
    })

    it('returns an error when password does not match confirmation', function (done) {
      var account = new Account({email: 'test@example.com'})
      account.setPassword(password, 'notthepassword', function (err) {
        assert.ok(err)
        assert.isObject(err)

        assert.isNull(account.hash)
        assert.isNull(account.salt)

        done()
      })
    })

  })

  describe('#validPassword', function () {
    var account, password = 'test@example.com'

    beforeEach(function (done) {
      var a = new Account({email: 'test@example.com'})
      a.setPassword(password, password, function (err) {
        a.save(function (err) {
          assert.isNull(err)
          account = a
          done()
        })
      })
    })

    it('compares given password with actual password', function (done) {
      var isValid = account.validPassword(password)

      assert.isTrue(isValid)

      isValid = account.validPassword('nope')

      assert.isFalse(isValid)

      done()
    })
  })

})
