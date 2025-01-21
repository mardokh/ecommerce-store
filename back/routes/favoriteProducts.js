//  MODULES IMPORTS //
const express = require('express')
const controller = require('../controllers/favoriteProducts')

// EXPRESS ROUTER INSTANCIATE //
let router = express.Router()


// GET ALL FAVORITES PRODUCTS //
router.get('', controller.getFavoritesProducts)

// ADD FAVORITE PRODUCT //
router.put('/create', controller.createFavoriteProduct)

// DELETE AN FAVORITE PRODUCT //
router.delete('/delete/:id', controller.deleteFavoriteProduct)


// EXPORTS //
module.exports = router