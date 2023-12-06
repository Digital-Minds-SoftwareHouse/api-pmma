const express = require('express')
const router = express.Router()

const UserController = require('../Controllers/UsuariosController')
const upload = require('../Config/Multer')

router.get('/', UserController.getOfficers)
router.get('/:id', UserController.getEspecificOfficer)
router.post('/', upload.single("file"), UserController.postOfficers)
router.delete('/', UserController.deleteOfficer)
router.put('/:id_policial?', upload.single("file"), UserController.pathOfficer)

module.exports = router