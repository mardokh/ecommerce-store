//  MODULES IMPORTS //
const express = require('express')
const controller = require('../controllers/favoriteProducts')
const { validateGetFavorites, validateCreateFavorite, validateDeleteFavorite } = require('../middlewares/validateFavorites')

// EXPRESS ROUTER INSTANCIATE //
let router = express.Router()


// GET ALL FAVORITES PRODUCTS //
router.get('', validateGetFavorites, controller.getFavoritesProducts)

// ADD FAVORITE PRODUCT //
router.put('/create', validateCreateFavorite, controller.createFavoriteProduct)

// DELETE AN FAVORITE PRODUCT //
router.delete('/delete/:id', validateDeleteFavorite, controller.deleteFavoriteProduct)


// EXPORTS //
module.exports = router