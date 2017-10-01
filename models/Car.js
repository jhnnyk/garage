const mongoose = require('mongoose')
const Schema = mongoose.Schema
const {Fillup} = require('./Fillup')

const carSchema = mongoose.Schema({
  year: type: Number,
  make: String,
  model: String,
  name: {type: String, required: true},
  notes: String,
  fillups: [{ type: Schema.Types.ObjectId, ref: 'Fillup' }]
})

carSchema.methods.apiRepr = function () {
  return {
    id: this._id,
    year: this.year,
    make: this.make,
    model: this.model,
    name: this.name,
    notes: this.notes
  }
}

const Car = mongoose.model('Car', carSchema)

module.exports = {Car}
