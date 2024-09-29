//  MODULES IMPORTS //
const express = require('express')
const controller = require('../controllers/users')


// EXPRESS ROUTER INSTANCIATE //
let router = express.Router()

// GET USER //
router.get('/:id', controller.getUser)

// USER ADD //
router.put('/add', controller.createUser)

// USER LOGIN //
router.post('/login', controller.loginUser)


// EXPORT MODULES
module.exports = router