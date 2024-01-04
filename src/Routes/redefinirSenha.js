const express = require('express')
const router = express.Router()

const RedefinirSenhaController = require('../Controllers/RedefinirSenhaController')

router.post("/send-id", RedefinirSenhaController.postRedefineSendId)
router.post("/send-verification-code", RedefinirSenhaController.postRedefineConfirmCode)
router.post("/redefine-password", RedefinirSenhaController.postRedefinePass )

module.exports = router