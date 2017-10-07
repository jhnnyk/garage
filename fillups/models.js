const mongoose = require('mongoose')
const Schema = mongoose.Schema

mongoose.Promise = global.Promise

const FillupSchema = mongoose.Schema({
  mileage: {type: Number, required: true},
  brand: String,
  location: String,
  gallons: {type: Number, required: true},
  price: {type: Number, required: true},
  notes: String,
  mpg: Number,
  car: { type: Schema.Types.ObjectId, ref: 'Car' }
})

FillupSchema.virtual('pricePerGallon').get(function () {
  return `$${(this.price / this.gallons).toFixed(2)}`
})

FillupSchema.methods.apiRepr = function () {
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

const Fillup = mongoose.model('Fillup', FillupSchema)

const calculateMPG = (carId) => {
  return Fillup
    .find({ car: carId })
    .sort({ mileage: -1 })
  .then(allFillups => {
    let count = 0
    let fillupPromise = new Promise((resolve, reject) => {
      for (let i = 0; i < allFillups.length - 1; i++) {
        allFillups[i].mpg = ((allFillups[i].mileage - allFillups[ i + 1 ].mileage) / allFillups[i].gallons).toFixed(1)
        Fillup
          .findByIdAndUpdate(allFillups[i].id, {mpg: allFillups[i].mpg})
          .then(() => {
            count++
            if (count === allFillups.length - 1) {
              resolve()
            }
          })
          .catch(err => {
            reject(err)
          })
      }
    })

    return fillupPromise
  })
}

module.exports = {Fillup, calculateMPG}
