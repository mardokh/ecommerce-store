//  MODULES IMPORTS //
const express = require('express')
const controller = require('../controllers/admin')
const {validateCreateAdmin, validateLoginAdmin} = require('../middlewares/validateAdmin')


// EXPRESS ROUTER INSTANCIATE //
let router = express.Router()

// ADMIN CREATE //
router.put('/create', validateCreateAdmin, controller.createAdmin)

// ADMIN LOGIN //
router.post('/login', validateLoginAdmin, controller.loginAdmin)


// EXPORT MODULES
module.exports = router