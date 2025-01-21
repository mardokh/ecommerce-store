//  MODULES IMPORTS //
const express = require('express')
const controller = require('../controllers/productsReviews')
//const checkTokenMIddleware = require('../jsonwebtoken/check_jwt_endPoints')



// EXPRESS ROUTER INSTANCIATE //
let router = express.Router()


// GET REVIEWS //
router.get('', controller.getProductReview)

// CREATE REVIEW //
router.put('/create', controller.createProductReview)

// UPDATE REVIEW //
router.patch('/update', controller.updateProductReview)

// DELETE REVIEW //
router.delete('/delete/:reviewId/:userId/:productId', controller.deleteProductReview)



// EXPORTS //
module.exports = router