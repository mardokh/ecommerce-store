//  MODULES IMPORTS //
const express = require('express')
const controller = require('../controllers/recipesReviews')
//const checkTokenMIddleware = require('../jsonwebtoken/check_jwt_endPoints')
const {validateGetRcpReviews, validateCreateRcpReviews, validateUpdateRcpReviews, 
    validateDeleteRcpReviews } = require('../middlewares/validateRcpReviews')


// EXPRESS ROUTER INSTANCIATE //
let router = express.Router()

// GET REVIEWS //
router.get('/:id', validateGetRcpReviews, controller.getRecipesReviews)

// CREATE REVIEW //
router.put('/create', validateCreateRcpReviews, controller.createRecipesReviews)

// UPDATE REVIEW //
router.patch('/update', validateUpdateRcpReviews, controller.updateRecipesReviews)

// DELETE REVIEW //
router.delete('/delete/:reviewId/:userId/:recipeId', validateDeleteRcpReviews, controller.deleteRecipesReviews)



// EXPORTS //
module.exports = router