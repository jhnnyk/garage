const bodyParser = require('body-parser')
const express = require('express')
const router = express.Router()
const expressSanitized = require('express-sanitized')
const passport = require('passport')

const {Car} = require('./models')
const {User} = require('../users')

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))
router.use(expressSanitized())

router.get('/', 
  passport.authenticate('jwt', {session: false}),
  (req, res) => {
    // find current user
    User
      .findOne({ username: req.user.username })
      .then((user) => {
        return Car
          .find({ owner: user._id })
      })
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

router.post('/', 
  passport.authenticate('jwt', {session: false}),
  (req, res) => {
    // check that name has been filled in
    if (!('name' in req.body)) {
      let message = 'Missing `name` in request body'
      console.error(message)
      return res.status(400).send(message)
    }

    // find user that owns this car
    User
      .findOne({ username: req.user.username })
      .then((user) => {
        // create the Car
        return Car
          .create({
            year: req.body.year,
            make: req.body.make,
            model: req.body.model,
            name: req.body.name,
            notes: req.body.notes,
            owner: user._id
          })
      })
      .then(car => res.status(201).json(car.apiRepr()))
      .catch(err => {
        console.error(err)
        res.status(500).json({error: 'Internal server error'})
      })
})

router.put('/:id', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    })
  }

  const updated = {}
  const updateableFields = ['year', 'make', 'model', 'name', 'notes']
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field]
    }
  })

  Car
    .findByIdAndUpdate(req.params.id, {$set: updated}, {new: true})
    .then(updatedCar => res.status(204).end())
    .catch(err => {
      console.error(err)
      res.status(500).json({message: 'Internal server error'})
    })
})

router.delete('/:id', (req, res) => {
  Car
    .findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).json({message: 'successfully deleted car'})
    })
    .catch(err => {
      console.error(err)
      res.status(500).json({error: 'Internal server error'})
    })
})

module.exports = {router}
