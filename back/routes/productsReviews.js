//  MODULES IMPORTS //
const express = require('express')
const controller = require('../controllers/productsReviews')
//const checkTokenMIddleware = require('../jsonwebtoken/check_jwt_endPoints')
const {validateGetPrdReviews, validateCreatePrdReviews, validateUpdatePrdReviews,
    validateDeletePrdReviews } = require('../middlewares/validatePrdReviews')


// EXPRESS ROUTER INSTANCIATE //
let router = express.Router()


// GET REVIEWS //
router.get('/:id', validateGetPrdReviews, controller.getProductReview)

// CREATE REVIEW //
router.put('/create', validateCreatePrdReviews, controller.createProductReview)

// UPDATE REVIEW //
router.patch('/update', validateUpdatePrdReviews, controller.updateProductReview)

// DELETE REVIEW //
router.delete('/delete/:reviewId/:userId/:productId', validateDeletePrdReviews, controller.deleteProductReview)



// EXPORTS //
module.exports = router