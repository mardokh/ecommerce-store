//  MODULES IMPORTS //
const express = require('express')
const controller = require('../controllers/shoppingCart') 


// EXPRESS ROUTER INSTANCIATE //
let router = express.Router()

// GET CARTS //
router.get('/carts', controller.getShoppingCart)

// CREATE CART //
router.put('/carts/create', controller.createShoppingCart)

// DELETE CART //
router.delete('/carts/delete/:id/:limit',  controller.deleteShoppingCart)


// EXPORTS //
module.exports = router
