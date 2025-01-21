//  MODULES IMPORTS //
const express = require('express')
const controller = require('../controllers/admin')

// EXPRESS ROUTER INSTANCIATE //
let router = express.Router()


// ADMIN CREATE //
router.put('/create', controller.createAdmin)

// ADMIN LOGIN //
router.post('/login', controller.loginAdmin)


// EXPORT MODULES
module.exports = router