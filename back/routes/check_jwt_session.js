//  MODULES IMPORTS //
const express = require('express')
const controller = require('../jsonwebtoken/check_jwt_session')

// EXPRESS ROUTER INSTANCIATE //
let router = express.Router()


// CHECK CLIENT JWT SESSION //
router.post('/jwt', controller.checkSessionToken)


// EXPORT MODULES
module.exports = router