const express = require('express')
const passport = require('passport')
const jwt = require('jsonwebtoken')

const config = require('../config')

const createAuthToken = user => {
  return jwt.sign({user}, config.JWT_SECRET, {
    subject: user.username,
    expiresIn: config.JWT_EXPIRY,
    algorithm: 'HS256'
  })
}

const router = express.Router()

router.post('/login',
  // The user provides a username and password to login
  passport.authenticate('basic',
    { session: false, failWithError: true }),
    (req, res, next) => {
      const authToken = createAuthToken(req.user.apiRepr())
      return res.json({ authToken })
    },
    (err, req, res, next) => {
      if (err) {
        res._headers['www-authenticate'] = '' // prevent native browser authentication popup
        return res.json(err)
      }
    }
)

router.post('/refresh',
  // The user exchanges an existing valid JWT
  // for a new one with a later expiration
  passport.authenticate('jwt', {session: false}),
  (req, res) => {
    const authToken = createAuthToken(req.user)
    res.json({ authToken })
  }
)

module.exports = {router}
