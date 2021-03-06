const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')

const {User} = require('./models')

const router = express.Router()

const jsonParser = bodyParser.json()

// POST endpoint to register a new user
router.post('/', jsonParser, (req, res) => {
  // make sure required fields are filled in
  const requiredFields = ['username', 'password']
  const missingField = requiredFields.find(field => !(field in req.body))

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    })
  }

  // make sure fields are all strings
  const stringFields = ['username', 'password', 'firstName', 'lastName']
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== 'string'
  )

  if (nonStringField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Incorrect field type: expected string',
      location: nonStringField
    })
  }

  // explicitly trim username and password so that the user
  // doesn't get confused with a username or password that
  // accidentally has a space at the beginning or end
  const explicitlyTrimmedFields = ['username', 'password']
  const nonTrimmedField = explicitlyTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
  )

  if (nonTrimmedField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Cannot start or end with whitespace',
      location: nonTrimmedField
    })
  }

  // make sure username and password are the right length
  const sizedFields = {
    username: {
      min: 1
    },
    password: {
      min: 8,
      max: 72
    }
  }
  const tooSmallField = Object.keys(sizedFields).find(
    field => 
      'min' in sizedFields[field] && 
      req.body[field].trim().length < sizedFields[field].min
  )
  const tooLargeField = Object.keys(sizedFields).find(
    field => 
      'max' in sizedFields[field] &&
      req.body[field].trim().length > sizedFields[field].max
  )

  if (tooSmallField || tooLargeField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: tooSmallField
        ? `Must be at least ${sizedFields[tooSmallField].min} characters long`
        : `Must be at most ${sizedFields[tooLargeField].max} characters long`,
      location: tooSmallField || tooLargeField
    })
  }

  let {username, password, firstName = '', lastName = ''} = req.body
  // Username and password come in trimmed or we throw an error (see above)
  // Now we trim the first and last names
  firstName = firstName.trim()
  lastName = lastName.trim()

  return User
    .find({ username })
    .count()
    .then(count => {
      if (count > 0) {
        // There is an existing user with the same username
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Username already taken',
          location: 'username'
        })
      }
      return User.hashPassword(password)
    })
    .then(hash => {
      return User.create({
        username,
        password: hash,
        firstName,
        lastName
      })
    })
    .then(user => {
      return res.status(201).json(user.apiRepr())
    })
    .catch(err => {
      // Forward validation errors on to the client, otherwise
      // give a 500 error because something unexpected has happened
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err)
      }
      res.status(500).json({code: 500, message: 'Internal server error'})
    })
})

// Never expose all your users like below in a prod application
// we're just doing this so we have a quick way to see
// if we're creating users. keep in mind, you can also
// verify this in the Mongo shell.
router.get('/', (req, res) => {
  return User
    .find()
    .then(users => res.json(users.map(user => user.apiRepr())))
    .catch(err => res.status(500).json({message: 'Internal server error'}))
})

module.exports = {router}
