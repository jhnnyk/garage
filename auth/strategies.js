const passport = require('passport')
const {BasicStrategy} = require('passport-http')
const {Strategy: JwtStrategy, ExtractJwt} = require('passport-jwt')

const {User} = require('../users/models') // could I also just get this from the users index file and just use '../users' ??
const {JWT_SECRET} = require('../config')

const basicStrategy = new BasicStrategy((username, password, callback) => {
  let user
  User
    .findOne({username: username})
    .then(_user => {
      user = _user
      if (!user) {
        // Return a rejected promise so we break out of the chain of .thens.
        // Any errors like this will be handled in the catch block.
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect username or password'
        })
      }
      return user.validatePassword(password)
    })
    .then(isValid => {
      if (!isValid) {
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect username or password'
        })
      }
      return callback(null, user)
    })
    .catch(err => {
      if (err.reason === 'LoginError') {
        return callback(null, false, err)
      }
      return callback(err, false)
    })
})

const jwtStrategy = new JwtStrategy(
  {
    secretOrKey: JWT_SECRET,
    // Look for the JWT as a Bearer auth header
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
    // Only allow HS256 tokens - the same as the ones we issue
    algorithms: ['HS256']
  },
  (payload, done) => {
    done(null, payload.user)
  }
)

module.exports = {basicStrategy, jwtStrategy}
