const express = require('express')
const router = express.Router()

const AssetsController = require('../Controllers/AssetsController')

router.get('/upms', AssetsController.GettAllUpm)
router.post('/upms', AssetsController.postUpm)
router.post('/upms/specific', AssetsController.getSpecifcUpm)
router.delete('/upms', AssetsController.deleteUpm)
router.patch('/upms', AssetsController.UpdateUpm)
router.get('/cities', AssetsController.getAllCities)
router.get('/neighborhoods',AssetsController.getAllNeighborhoods )
router.post('/seed_user', AssetsController.seedUsers)

module.exports = router