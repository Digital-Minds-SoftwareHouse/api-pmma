const express = require('express')
const router = express()

const RegReportAccessController = require('../Controllers/RegReportAccessController')

router.get('/', RegReportAccessController.getPermission)
router.get('/:battalion', RegReportAccessController.getBattalionRequests)
router.get('/officerRequests/:userId', RegReportAccessController.getOfficersRequests)
router.post('/', RegReportAccessController.postPermission)
router.patch('/', RegReportAccessController.patchPermission)
router.patch('/finalyReport', RegReportAccessController.patchFinalyReport)

module.exports = router