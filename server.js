const bodyParser = require('body-parser')
const express = require('express')
const mongoose = require('mongoose')

const {DATABASE_URL, PORT} = require('./config')
const {Fillup} = require('./models')

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

mongoose.Promise = global.Promise

app.use(express.static('public'))

app.get('/api/fillups', (req, res) => {
  // show all fillups sorted my mileage, newest first
  Fillup
    .find()
    .sort({ mileage: -1 })
    .then(fillups => {
      res.json({
        fillups: fillups.map(
          (fillup) => fillup.apiRepr())
      })
    })
    .catch(err => {
      console.error(err)
      res.status(500).json({message: 'Internal server error'})
    })
})

app.post('/api/fillups', (req, res) => {
  // check that all required fields have been filled in
  const requiredFields = ['mileage', 'gallons', 'price']
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i]
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message)
      return res.status(400).send(message)
    }
  }

  // create the Fillup
  Fillup
    .create({
      mileage: req.body.mileage,
      brand: req.body.brand,
      location: req.body.location,
      gallons: req.body.gallons,
      price: req.body.price,
      notes: req.body.notes
    })
    .then(
      fillup => res.status(201).redirect('/')
    )
    .catch(err => {
      console.error(err)
      res.status(500).json({message: 'Internal server error'})
    })
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
