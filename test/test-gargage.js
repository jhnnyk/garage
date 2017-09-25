const chai = require('chai')
const chaiHttp = require('chai-http')
const mongoose = require('mongoose')

const {app, runServer, closeServer} = require('../server')
const {TEST_DATABASE_URL} = require('../config')

const should = chai.should()
chai.use(chaiHttp)

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
