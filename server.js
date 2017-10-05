require('dotenv').config()
const bodyParser = require('body-parser')
const express = require('express')
const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const morgan = require('morgan')
const passport = require('passport')

const {DATABASE_URL, PORT} = require('./config')

const app = express()

const {router: fillupRouter} = require('./fillups')
const {router: carRouter} = require('./cars')

// Logging
app.use(morgan('common'))

app.use(express.static('public'))

app.use('/api/fillups', fillupRouter)
app.use('/api/cars', carRouter)

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
