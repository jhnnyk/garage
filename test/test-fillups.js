const chai = require('chai')
const chaiHttp = require('chai-http')
const faker = require('faker')
const mongoose = require('mongoose')

const {Fillup} = require('../fillups')
const {app, runServer, closeServer} = require('../server')
const {TEST_DATABASE_URL} = require('../config')

const should = chai.should()
chai.use(chaiHttp)

function seedFillupData () {
  console.info('seeding fillup data...')
  const seedData = []

  for (let i = 1; i <= 10; i++) {
    seedData.push(generateFillupData())
  }

  return Fillup.insertMany(seedData)
}

function generateFillupData () {
  return {
    mileage: faker.random.number({min: 5000, max: 200000}),
    brand: faker.random.arrayElement(['Exxon', 'Chevron', 'Safeway', 'Loaf n Jug', 'Sinclair']),
    location: faker.address.city() + ', ' + faker.address.stateAbbr(),
    gallons: faker.random.number(25),
    price: faker.finance.amount(50, 100, 2)
  }
}

function tearDownDb () {
  console.warn('deleting database...')
  return mongoose.connection.dropDatabase()
}

describe('Fillup API resource', function () {
  before(function () {
    return runServer(TEST_DATABASE_URL)
  })

  beforeEach(function () {
    return seedFillupData()
  })

  afterEach(function () {
    return tearDownDb()
  })

  after(function () {
    return closeServer()
  })

  describe('GET endpoint', function () {
    it('should return the 10 most recent fillups', function () {
      let res
      return chai.request(app)
        .get('/api/fillups')
        .then(function (_res) {
          res = _res
          res.should.have.status(200)
          res.body.fillups.should.have.length.of.at.least(1)
          return Fillup.count()
        })
        .then(function (count) {
          res.body.fillups.should.have.lengthOf(count)
        })
    })

    it('should return fillups with the correct fields', function () {
      let resFillup
      return chai.request(app)
        .get('/api/fillups')
        .then(function (res) {
          res.should.have.status(200)
          res.should.be.json
          res.body.fillups.should.be.a('array')
          res.body.fillups.should.have.length.of.at.least(1)

          res.body.fillups.forEach(function (fillup) {
            fillup.should.be.a('object')
            fillup.should.include.keys(
              'id', 'mileage', 'gallons', 'price', 'pricePerGallon')
          })

          resFillup = res.body.fillups[0]
          return Fillup.findById(resFillup.id)
        })
        .then(function (fillup) {
          resFillup.id.should.equal(fillup.id)
          resFillup.mileage.should.equal(fillup.mileage)
          resFillup.price.should.equal(fillup.price)
          resFillup.gallons.should.equal(fillup.gallons)
          resFillup.pricePerGallon.should.equal(fillup.pricePerGallon)
        })
    })
  })

  describe('POST endpoint', function () {
    it('should add a new fillup', function () {
      const newFillup = generateFillupData()

      return chai.request(app)
        .post('/api/fillups')
        .send(newFillup)
        .then(function (res) {
          res.should.have.status(201)
          res.should.be.json
          res.body.should.be.a('object')
          res.body.should.include.keys('id', 'mileage', 'gallons', 'price')
          res.body.mileage.should.equal(newFillup.mileage)
          res.body.id.should.not.be.null
          return Fillup.findById(res.body.id)
        })
        .then(function (fillup) {
          fillup.mileage.should.equal(newFillup.mileage)
        })
    })
  })

  describe('PUT endpoint', function() {
    it('should update a fillup', function() {
      const updateData = {
        mileage: 12334,
        price: 34.95,
        gallons: 10.7,
        brand: 'Exxon Updated!',
        notes: 'updated content in notes field'
      }

      return Fillup.findOne()
      .then(function (fillup) {
        updateData.id = fillup.id

        return chai.request(app)
          .put(`/api/fillups/${fillup.id}`)
          .send(updateData)
      })
      .then(function (res) {
        res.should.have.status(204)
        return Fillup.findById(updateData.id)
      })
      .then(function (fillup) {
        fillup.mileage.should.equal(updateData.mileage)
        fillup.notes.should.equal(updateData.notes)
      })
    })
  })

  describe('DELETE endpoint', function () {
    it('deletes a fillup by id', function () {
      let fillup

      return Fillup
        .findOne()
        .then(function (_fillup) {
          fillup = _fillup
          return chai.request(app)
            .delete(`/api/fillups/${fillup.id}`)
        })
        .then(function (res) {
          res.should.have.status(204)
          return Fillup.findById(fillup.id)
        })
        .then(function (_fillup) {
          should.not.exist(_fillup)
        })
    })
  })
})

describe('Static pages', function () {
  before(function () {
    return runServer(TEST_DATABASE_URL)
  })

  after(function () {
    return closeServer()
  })

  it('should show the homepage', function () {
    return chai.request(app)
      .get('/')
      .then(function (res) {
        res.should.have.status(200)
        res.should.be.html
      })
  })
})
