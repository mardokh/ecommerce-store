//  MODULES IMPORTS //
const express = require('express')
const controller = require('../controllers/users')
const {validateGetUser, validateCreateUser, validateLoginUser} = require('../middlewares/validateUsers')

// EXPRESS ROUTER INSTANCIATE //
let router = express.Router()

// GET USER //
router.get('/:id', validateGetUser, controller.getUser)

// USER ADD //
router.put('/create', validateCreateUser, controller.createUser)

// USER LOGIN //
router.post('/login', validateLoginUser, controller.loginUser)


// EXPORT MODULES
module.exports = router