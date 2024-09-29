//  MODULES IMPORTS //
const express = require('express')
const controller = require('../controllers/favoriteRecipes')

// EXPRESS ROUTER INSTANCIATE //
let router = express.Router()


// ADD FAVORITE RECIPE //
router.put('/add', controller.addFavoriteRecipe)


// GET ALL FAVORITES RECIPES //
router.get('', controller.getFavoritesRecipes)


// DELETE AN FAVORITE RECIPE //
router.delete('/delete/:id', controller.deleteFavoritesRecipes)


// GET FAVORITES PRODUCTS COUNT //
router.get('/count', controller.getFavoritesRecipesCount)


// EXPORTS //
module.exports = router