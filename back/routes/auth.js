//  MODULES IMPORTS //
const express = require('express')
const controller = require('../controllers/auth')


// EXPRESS ROUTER INSTANCIATE //
let router = express.Router()

// LOGIN ADMIN //
router.post('', controller.login)


// EXPORT MODULES
module.exports = router