const bodyParser = require('body-parser')
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const expressSanitized = require('express-sanitized')

const {Car} = require('../models/Car')

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))
router.use(expressSanitized())



module.exports = router
