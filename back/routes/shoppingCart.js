//  MODULES IMPORTS //
const express = require('express')
const controller = require('../controllers/shoppingCart') 
const {validateGetshoppingCarts, validateCreateshoppingCarts,
    validateDeleteshoppingCarts} = require('../middlewares/validationShoppingCart')


// EXPRESS ROUTER INSTANCIATE //
let router = express.Router()

// GET CARTS //
router.get('/carts', validateGetshoppingCarts, controller.getShoppingCart)

// CREATE CART //
router.put('/carts/create', validateCreateshoppingCarts, controller.createShoppingCart)

// DELETE CART //
router.delete('/carts/delete/:id/:limit', validateDeleteshoppingCarts, controller.deleteShoppingCart)


// EXPORTS //
module.exports = router
