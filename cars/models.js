const mongoose = require('mongoose')
const Schema = mongoose.Schema

mongoose.Promise = global.Promise

const CarSchema = mongoose.Schema({
  year: Number,
  make: String,
  model: String,
  name: {type: String, required: true},
  notes: String,
  fillups: [{ type: Schema.Types.ObjectId, ref: 'Fillup' }]
})

CarSchema.methods.apiRepr = function () {
  return {
    id: this._id,
    year: this.year,
    make: this.make,
    model: this.model,
    name: this.name,
    notes: this.notes
  }
}

const Car = mongoose.model('Car', CarSchema)

module.exports = {Car}
