const express = require('express')
const router = express.Router()

const DependenstController = require('../Controllers/DependentesController')


router.get('/', DependenstController.getDependents )
router.get('/individual/:id?', DependenstController.getIndividualDependent)
router.get('/per_officer/:id_policial?', DependenstController.getDependentsPerOfficer)
router.post('/', DependenstController.postDependents)
router.put('/:id?', DependenstController.putDependents)



module.exports = router