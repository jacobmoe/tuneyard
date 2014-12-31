#!/usr/bin/env node

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

var Account = require('../lib/models/account')
var prompt = require('prompt')
var db = require('../lib/db')

var schema = {
  properties: {
    'name': {
      required: true,
      default: 'Jane Doe'
    },
    'email': {
      pattern: /^.+\@.+\..+$/,
      message: 'Enter a valid email address',
      required: true,
      default: 'janedoe@example.com'
    },
    'password': {
      required: true,
      description: 'Password (minimum 6 characters)',
      hidden: true,
      default: 'passpass'
    },
    'passwordConfirmation': {
      required: true,
      hidden: true,
      default: 'passpass'
    }
  }
}

function createUser(result, cb) {
  Account.create(result, function (err, account) {
    if (err) console.log("Error creating user:", err)
    else console.log('Created user')

    process.exit()
  })
}

prompt.get(schema, function (err, result) {
  db.connect(function () {
    createUser(result)
  })
})

prompt.start()

