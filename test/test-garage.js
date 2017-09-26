const chai = require('chai')
const chaiHttp = require('chai-http')
const faker = require('faker')
const mongoose = require('mongoose')

const {Fillup} = require('../models')
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
    mileage: 123456,
    brand: faker.company.companyName,
    location: faker.address.city + ', ' + faker.address.stateAbbr,
    gallons: 13.5,
    price: 49.03
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
              'id', 'mileage', 'gallons', 'price')
          })

          resFillup = res.body.fillups[0]
          return Fillup.findById(resFillup.id)
        })
        .then(function (fillup) {
          resFillup.id.should.equal(fillup.id)
          resFillup.mileage.should.equal(fillup.mileage)
          resFillup.price.should.equal(fillup.price)
          resFillup.gallons.should.equal(fillup.gallons)
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
