const mongoose = require('mongoose')

const fillupSchema = mongoose.Schema({
  mileage: {type: Number, required: true},
  brand: String,
  location: String,
  gallons: {type: Number, required: true},
  cost: {type: Number, required: true},
  notes: String
})

fillupSchema.virtual('pricePerGallon').get(function () {
  return cost / gallons
})

const Fillup = mongoose.model('Fillup', fillupSchema)

module.exports = {Fillup}
