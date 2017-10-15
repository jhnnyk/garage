const bodyParser = require('body-parser')
const express = require('express')
const router = express.Router()
const expressSanitized = require('express-sanitized')

const {Fillup, calculateMPG} = require('./models')

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))
router.use(expressSanitized())

router.get('/', (req, res) => {
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

router.get('/:carId', (req, res) => {
  Fillup
    .find({ car: req.params.carId })
    .sort({ mileage: -1 })
    .then(fillups => {
      res.json({fillups: fillups.map(fillup => fillup.apiRepr())})
    })
    .catch(err => {
      console.error(err)
      res.status(500).json({error: 'Internal server error'})
    })
})

router.post('/', (req, res) => {
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

  let fillup = {}
  // create the Fillup
  Fillup
    .create({
      mileage: req.body.mileage,
      brand: req.body.brand,
      location: req.body.location,
      gallons: req.body.gallons,
      price: req.body.price,
      notes: req.body.notes,
      car: req.body.car
    })
    .then(_fillup => {
      fillup = _fillup
      return calculateMPG(fillup.car)
    })
    .then(() => {
      res.status(201).json(fillup.apiRepr())
    })
    .catch(err => {
      console.error(err)
      res.status(500).json({message: 'Internal server error'})
    })
})

router.put('/:id', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (`
      Request path id (${req.params.id}) and
      request body id (${req.body.id}) must match
    `)
    console.error(message)
    res.status(400).json({message: message})
  }

  const toUpdate = {}
  const updateableFields = ['brand', 'location', 'mileage', 'gallons', 'price', 'notes']

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field]
    }
  })

  Fillup
    .findByIdAndUpdate(req.params.id, {$set: toUpdate})
    .then(updatedFillup => {
      return calculateMPG(updatedFillup.car)
    })
    .then(() => {
      res.status(204).end()
    })
    .catch(err => {
      console.error(err)
      res.status(500).json({message: 'Internal server error'})
    })
})

router.delete('/:id', (req, res) => {
  Fillup
    .findByIdAndRemove(req.params.id)
    .then(() => { calculateMPG() })
    .then(() => {
      console.log(`Deleted fillup with id \`${req.params.id}\``)
      res.status(204).end()
    })
    .catch(err => {
      console.error(err)
      res.status(500).json({message: 'Internal server error'})
    })
})

module.exports = {router}
