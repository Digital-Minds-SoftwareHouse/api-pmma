const express = require('express')
const router = express.Router()

const ReportController = require('../Controllers/ReportsController')
const SummaryReportsCOntroller = require('../Controllers/SummaryReportsController')
const ReportsQuantityController = require('../Controllers/ReportsQuantityController')

router.get('/', ReportController.getAllReports)
router.post('/summary_reports_officer' , SummaryReportsCOntroller.reportsPerOfficer)
router.get('/:battalion/:number_report', ReportController.getSpecificReport)
router.get('/summary_reports', SummaryReportsCOntroller.getSummaryAllReports )
router.get('/reportsQuantity',  ReportsQuantityController.reportsAllQuantity)
router.post('/', ReportController.postReport)
router.delete('/', ReportController.deleteReport)
router.put('/', ReportController.putReport)

module.exports = router
