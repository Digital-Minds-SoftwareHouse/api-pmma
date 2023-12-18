const express = require('express')
const router = express.Router()

const ReportsQuantityController = require('../Controllers/ReportsQuantityController')

router.get('/', ReportsQuantityController.reportsAllQuantity)

module.exports = router
