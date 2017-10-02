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

module.exports = router
