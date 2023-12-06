const express = require('express')
const router = express.Router()

const ReportController = require('../Controllers/ReportsController')

router.get('/', ReportController.getAllReports)
router.get('/:battalion/:number_report', ReportController.getSpecificReport)
router.post('/', ReportController.postReport)
router.delete('/', ReportController.deleteReport)
router.put('/', ReportController.putReport)

module.exports = router