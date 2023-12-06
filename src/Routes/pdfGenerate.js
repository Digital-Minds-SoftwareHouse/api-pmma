const express = require('express')
const router = express.Router()

const PDFGenerateOntroller = require('../Controllers/PdfGenerateController')

router.get('/:battalion/:report_number' , PDFGenerateOntroller.pdfReportGenerate)

module.exports = router