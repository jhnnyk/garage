require('dotenv').config()
const bodyParser = require('body-parser')
const express = require('express')
const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const morgan = require('morgan')
const passport = require('passport')

const {DATABASE_URL, PORT} = require('./config')

const app = express()

const {router: usersRouter} = require('./users')
const {router: authRouter, basicStrategy, jwtStrategy} = require('./auth')
const {router: fillupRouter} = require('./fillups')
const {router: carRouter} = require('./cars')

// Logging
app.use(morgan('common'))

// CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE')
  if (req.method === 'OPTIONS') {
    return res.send(204)
  }
  next()
})

app.use(express.static('public'))

app.use(passport.initialize())
passport.use(basicStrategy)
passport.use(jwtStrategy)

app.use('/api/users/', usersRouter)
app.use('/api/auth/', authRouter)
app.use('/api/fillups', fillupRouter)
app.use('/api/cars', carRouter)

// A protected endpoint which needs a valid JWT to access it
app.get('/api/protected',
  passport.authenticate('jwt', {session: false}),
  (req, res) => {
    return res.json({ data: 'winter is coming' })
  }
)

let server

// this function connects to our database, then starts the server
function runServer (databaseUrl = DATABASE_URL, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, {useMongoClient: true}, err => {
      if (err) {
        return reject(err)
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`)
        resolve()
      })
      .on('error', err => {
        mongoose.disconnect()
        reject(err)
      })
    })
  })
}

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer () {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server')
      server.close(err => {
        if (err) {
          return reject(err)
        }
        resolve()
      })
    })
  })
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer().catch(err => console.error(err))
}

module.exports = {runServer, app, closeServer}
