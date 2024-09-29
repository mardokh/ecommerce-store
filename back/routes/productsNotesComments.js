//  MODULES IMPORTS //
const express = require('express')
const controller = require('../controllers/productsNotesComments')
//const checkTokenMIddleware = require('../jsonwebtoken/check_jwt_endPoints')



// EXPRESS ROUTER INSTANCIATE //
let router = express.Router()


// GET ALL REVEIWS //
router.get('', controller.getProductsNotesComments)

// ADD REVEIW //
router.put('/add', controller.addProductsNotesComments)

// UPDATE REVEIW //
router.patch('/update', controller.updateProductsNotesComments)

// DELETE REVIWE
router.delete('/delete/:id', controller.deleteProductsNotesComments)



// EXPORTS //
module.exports = router