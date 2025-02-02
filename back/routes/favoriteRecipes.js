//  MODULES IMPORTS //
const express = require('express')
const controller = require('../controllers/favoriteRecipes')
const { validateGetFavorites, validateCreateFavorite, validateDeleteFavorite } = require('../middlewares/validateFavorites')

// EXPRESS ROUTER INSTANCIATE //
let router = express.Router()


// GET ALL FAVORITES RECIPES //
router.get('', validateGetFavorites, controller.getFavoritesRecipes)

// ADD FAVORITE RECIPE //
router.put('/create', validateCreateFavorite, controller.createFavoriteRecipe)

// DELETE AN FAVORITE RECIPE //
router.delete('/delete/:id', validateDeleteFavorite, controller.deleteFavoriteRecipe)


// EXPORTS //
module.exports = router