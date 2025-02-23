//  MODULES IMPORTATION //
const express = require('express')
const controller = require('../controllers/products')
const checkTokenMIddleware = require('../jsonwebtoken/check_jwt_endPoints')
const upload = require('../middlewares/multerConfig')
const {validateGetProduct, validateCreateProduct, validateUpdateProduct,
     validateDeleteProduct, validateDeleteSecondaryImage } = require('../middlewares/validateProducts')

// EXPRESS ROUTER INSTANCIATE //
let router = express.Router()


// GET PRODUCTS //
router.get('', controller.getAllProducts)

// GET PRODUCT //
router.get('/:id', validateGetProduct, controller.getOneProduct)

// GET CATEGORIES NAMES //
router.get('', controller.getCategoriesNames)

// CREATE PRODUCT //
router.put('/create', upload, validateCreateProduct, controller.createProduct)

// UPDATE PRODUCT //
router.patch('/update', upload, validateUpdateProduct, controller.updateProduct)

// DELETE PRODUCT //
router.delete('/delete/:id', checkTokenMIddleware, validateDeleteProduct, controller.deleteProduct)

// DELETE SECONDARY IMAGE //
router.delete('/secondaryimage/:id', checkTokenMIddleware, validateDeleteSecondaryImage, controller.deleteSecondaryImage)


// EXPORTS //
module.exports = router