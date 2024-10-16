//  MODULES IMPORTS //
const express = require('express')
const controller = require('../controllers/recipesReviews')
//const checkTokenMIddleware = require('../jsonwebtoken/check_jwt_endPoints')



// EXPRESS ROUTER INSTANCIATE //
let router = express.Router()


// GET ALL REVEIWS //
router.get('', controller.getRecipesReviews)

// ADD REVEIW //
router.put('/add', controller.addRecipesReviews)

// UPDATE REVEIW //
router.patch('/update', controller.updateRecipesReviews)

// DELETE REVIWE
router.delete('/delete/:reviewId/:userId/:recipeId', controller.deleteRecipesReviews)



// EXPORTS //
module.exports = router