//  MODULES IMPORTATION //
const express = require('express')
const controller = require('../controllers/recipes')
const multer = require('multer')
const path = require('path')
const checkTokenMIddleware = require('../jsonwebtoken/check_jwt_endPoints')

// EXPRESS ROUTER INSTANCIATE //
let router = express.Router()


// GET ALL RECIPES  //
router.get('', controller.getAllRecipes)


// GET ONE RECIPE //
router.get('/:id', controller.getOnRecipe)


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


// PUT RECIPE //
router.put('/add', upload.single('image'), checkTokenMIddleware, controller.putRecipe)


// UPDATE RECIPE //
router.patch('/update', upload.single('image'), checkTokenMIddleware, controller.updateRecipe)


// DELETE RECIPE //
router.delete('/delete/:id', checkTokenMIddleware, controller.deleteRecipe)




// EXPORT MODULES
module.exports = router