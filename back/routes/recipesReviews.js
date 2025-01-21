//  MODULES IMPORTS //
const express = require('express')
const controller = require('../controllers/recipesReviews')
//const checkTokenMIddleware = require('../jsonwebtoken/check_jwt_endPoints')



// EXPRESS ROUTER INSTANCIATE //
let router = express.Router()


// GET REVIEWS //
router.get('', controller.getRecipesReviews)

// CREATE REVIEW //
router.put('/create', controller.createRecipesReviews)

// UPDATE REVIEW //
router.patch('/update', controller.updateRecipesReviews)

// DELETE REVIEW //
router.delete('/delete/:reviewId/:userId/:recipeId', controller.deleteRecipesReviews)



// EXPORTS //
module.exports = router