const express = require('express')
const mongoose = require('mongoose')

const {DATABASE_URL, PORT} = require('./config')
const {Fillup} = require('./models')

const app = express()

mongoose.Promise = global.Promise

app.use(express.static('public'))

app.get('/fillups', (req, res) => {
  // res.sendFile('index.html')
  Fillup
    .find()
    .then(fillups => {
      res.json({fillups})
    })
    .catch(
      err => {
        console.error(err)
        res.status(500).json({message: 'Internal server error'})
      }
    )
})

let server

// this function connects to our database, then starts the server
function runServer (databaseUrl = DATABASE_URL, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
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
