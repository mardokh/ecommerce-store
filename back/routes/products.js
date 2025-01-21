//  MODULES IMPORTATION //
const express = require('express')
const controller = require('../controllers/products')
const multer = require('multer')
const path = require('path')
const checkTokenMIddleware = require('../jsonwebtoken/check_jwt_endPoints')


// EXPRESS ROUTER INSTANCIATE //
let router = express.Router()


//  GET ALL PRODUCTS  //
router.get('', controller.getAllProducts)


//  GET ONE PRODUCT  //
router.get('/:id', controller.getOneProduct)


// MULTER CONFIGURATION FOR STORING IMAGES //
var storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null,"./uploads")
    },
    filename: (req, file, callback) => {
        callback(null, `image-${Date.now()}.${file.originalname}`)
    }
})
var upload = multer({
    storage: storage
})


// CREATE PRODUCT //
router.put('/create', checkTokenMIddleware, upload.fields([{name: 'image', maxCount: 1}, {name: 'images', maxCount: 10}]), controller.createProduct)


// UPDATE PRODUCT //
router.patch('/update', checkTokenMIddleware, upload.fields([{name: 'image', maxCount: 1}, {name: 'images', maxCount: 10}]), controller.updateProduct)


// DELETE PRODUCT //
router.delete('/delete/:id', checkTokenMIddleware, controller.deleteProduct)


// DELETE SECONDARY IMAGE //
router.delete('/secondaryimage/:id', checkTokenMIddleware, controller.deleteSecondaryImage)



// EXPORTS //
module.exports = router