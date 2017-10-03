const mongoose = require('mongoose')
const Schema = mongoose.Schema
const {Car} = require('./Car')

const fillupSchema = mongoose.Schema({
  mileage: {type: Number, required: true},
  brand: String,
  location: String,
  gallons: {type: Number, required: true},
  price: {type: Number, required: true},
  notes: String,
  mpg: Number,
  car: { type: Schema.Types.ObjectId, ref: 'Car' }
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
    mpg: this.mpg,
    car: this.car
  }
}

const Fillup = mongoose.model('Fillup', fillupSchema)

const calculateMPG = () => {
  return Fillup
    .find()
    .sort({ mileage: -1 })
  .then(allFillups => {
    for (let i = 0; i < allFillups.length - 1; i++) {
      allFillups[i].mpg = ((allFillups[i].mileage - allFillups[i+1].mileage) / allFillups[i].gallons).toFixed(1)
      Fillup
        .findByIdAndUpdate(allFillups[i].id, {mpg: allFillups[i].mpg})
        .then() // the function did NOT work until I add this line
        // what am I still missing about Promises?
    }
  })
  .catch(err => {
    console.error(err)
  })
}

module.exports = {Fillup, calculateMPG}
