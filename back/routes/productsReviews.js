//  MODULES IMPORTS //
const express = require('express')
const controller = require('../controllers/productsReviews')
//const checkTokenMIddleware = require('../jsonwebtoken/check_jwt_endPoints')



// EXPRESS ROUTER INSTANCIATE //
let router = express.Router()


// GET ALL REVEIWS //
router.get('', controller.getProductReview)

// ADD REVEIW //
router.put('/add', controller.addProductReview)

// UPDATE REVEIW //
router.patch('/update', controller.updateProductReview)

// DELETE REVIWE
router.delete('/delete/:id', controller.deleteProductReview)



// EXPORTS //
module.exports = router