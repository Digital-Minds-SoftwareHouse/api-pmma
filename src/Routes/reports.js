const express = require('express')
const router = express.Router()

const ReportController = require('../Controllers/ReportsController')
const SummaryReportsCOntroller = require('../Controllers/SummaryReportsController')

router.get('/', ReportController.getAllReports)
router.get('/:battalion/:number_report', ReportController.getSpecificReport)
router.get('/summary_reports', SummaryReportsCOntroller.getSummaryAllReports )
router.post('/', ReportController.postReport)
router.delete('/', ReportController.deleteReport)
router.put('/', ReportController.putReport)

module.exports = router