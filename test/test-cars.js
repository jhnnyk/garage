const chai = require('chai')
const chaiHttp = require('chai-http')
const faker = require('faker')
const mongoose = require('mongoose')

const {Car} = require('../cars')
const {app, runServer, closeServer} = require('../server')
const {TEST_DATABASE_URL} = require('../config')

const should = chai.should()
chai.use(chaiHttp)

function seedCarData () {
  console.info('seeding car data...')
  const seedData = []

  for (let i = 1; i <= 10; i++) {
    seedData.push(generateCarData())
  }

  return Car.insertMany(seedData)
}

function generateCarData () {
  return {
    year: faker.random.number({min: 1980, max: 2017}),
    make: faker.random.arrayElement(['Toyota', 'Chevrolet', 'Ford', 'Honda', 'BMW', 'Audi', 'Mercedes', 'Nissan']),
    model: faker.company.bsNoun(),
    name: faker.name.firstName(),
    notes: faker.company.catchPhrase()
  }
}

function tearDownDb () {
  console.warn('deleting database...')
  return mongoose.connection.dropDatabase()
}

describe('Car API resource', function () {
  before(function () {
    return runServer(TEST_DATABASE_URL)
  })

  beforeEach(function () {
    return seedCarData()
  })

  afterEach(function () {
    return tearDownDb()
  })

  after(function () {
    return closeServer()
  })

  describe('GET endpoint', function () {
    it('should return all the cars', function () {
      let res
      return chai.request(app)
        .get('/api/cars')
        .then(function (_res) {
          res = _res
          res.should.have.status(200)
          res.body.cars.should.have.length.of.at.least(1)
          return Car.count()
        })
        .then(function (count) {
          res.body.cars.should.have.lengthOf(count)
        })
    })

    it('should return cars with the correct fields', function () {
      let resCar
      return chai.request(app)
        .get('/api/cars')
        .then(function (res) {
          res.should.have.status(200)
          res.should.be.json
          res.body.cars.should.be.a('array')
          res.body.cars.should.have.length.of.at.least(1)

          res.body.cars.forEach(function (car) {
            car.should.be.a('object')
            car.should.include.keys('id', 'name')
          })

          resCar = res.body.cars[0]
          return Car.findById(resCar.id)
        })
        .then(function (car) {
          resCar.id.should.equal(car.id)
          resCar.name.should.equal(car.name)
        })
    })
  })

  describe('POST endpoint', function () {
    it('should add a new car', function () {
      const newCar = generateCarData()

      return chai.request(app)
        .post('/api/cars')
        .send(newCar)
        .then(function (res) {
          res.should.have.status(201)
          res.should.be.json
          res.body.should.be.a('object')
          res.body.should.include.keys('id', 'name')
          res.body.name.should.equal(newCar.name)
          res.body.id.should.not.be.null
          return Car.findById(res.body.id)
        })
        .then(function (car) {
          car.name.should.equal(newCar.name)
        })
    })
  })

  describe('PUT endpoint', function () {
    it('should update fields you send over', function () {
      const updateData = {
        name: 'Falalala',
        notes: 'This car has been updated!'
      }

      return Car
        .findOne()
        .then(function (car) {
          updateData.id = car.id

          return chai.request(app)
            .put(`/api/cars/${car.id}`)
            .send(updateData)
        })
        .then(function (res) {
          res.should.have.status(204)
          return Car.findById(updateData.id)
        })
        .then(function (car) {
          car.name.should.equal(updateData.name)
          car.notes.should.equal(updateData.notes)
        })
    })
  })

  describe('DELETE endpoint', function () {
    it('deletes a car by id', function () {
      let car

      return Car
        .findOne()
        .then(function (_car) {
          car = _car
          return chai.request(app)
            .delete(`/api/cars/${car.id}`)
        })
        .then(function (res) {
          res.should.have.status(204)
          return Car.findById(car.id)
        })
        .then(function (_car) {
          should.not.exist(_car)
        })
    })
  })
})
