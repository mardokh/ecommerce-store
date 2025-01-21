//  MODULES IMPORTS //
const express = require('express')
const controller = require('../controllers/favoriteRecipes')

// EXPRESS ROUTER INSTANCIATE //
let router = express.Router()


// GET ALL FAVORITES RECIPES //
router.get('', controller.getFavoritesRecipes)

// ADD FAVORITE RECIPE //
router.put('/create', controller.createFavoriteRecipe)

// DELETE AN FAVORITE RECIPE //
router.delete('/delete/:id', controller.deleteFavoriteRecipe)


// EXPORTS //
module.exports = router