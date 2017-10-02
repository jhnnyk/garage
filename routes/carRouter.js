const bodyParser = require('body-parser')
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const expressSanitized = require('express-sanitized')

const {Car} = require('../models/Car')

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))
router.use(expressSanitized())

router.get('/', (req, res) => {
  Car
    .find()
    .then(cars => {
      res.json({
        cars: cars.map(
          (car) => car.apiRepr())
      })
    })
    .catch(err => {
      console.error(err)
      res.status(500).json({message: 'Internal server error'})
    })
})

router.post('/', (req, res) => {
  // check that name has been filled in
  if (!('name' in req.body)) {
    console.error('Missing `name` in request body')
    return res.status(400).send(message)
  }

  // create the Car
  Car
    .create({
      year: req.body.year,
      make: req.body.make,
      model: req.body.model,
      name: req.body.name,
      notes: req.body.notes
    })
    .then(car => res.status(201).json(car.apiRepr()))
    .catch(err => {
      console.error(err)
      res.status(500).json({error: 'Something went wrong'})
    })
})

module.exports = router
