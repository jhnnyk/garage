const mongoose = require('mongoose')

const fillupSchema = mongoose.Schema({
  mileage: {type: Number, required: true},
  brand: String,
  location: String,
  gallons: {type: Number, required: true},
  price: {type: Number, required: true},
  notes: String,
  mpg: Number
})

fillupSchema.virtual('pricePerGallon').get(function () {
  return `$${(this.price / this.gallons).toFixed(2)}`
})

fillupSchema.methods.apiRepr = function () {
  return {
    id: this._id,
    mileage: this.mileage,
    brand: this.brand,
    location: this.location,
    gallons: this.gallons,
    price: this.price,
    pricePerGallon: this.pricePerGallon,
    notes: this.notes,
    mpg: this.mpg
  }
}

const Fillup = mongoose.model('Fillup', fillupSchema)

module.exports = {Fillup}
