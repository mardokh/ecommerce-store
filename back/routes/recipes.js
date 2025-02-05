//  MODULES IMPORTATION //
const express = require('express')
const controller = require('../controllers/recipes')
const checkTokenMIddleware = require('../jsonwebtoken/check_jwt_endPoints')
const upload = require('../middlewares/multerConfig')
const {validateGetRecipe, validateCreateRecipe, validateUpdateRecipe, 
    validateDeleteRecipe} = require('../middlewares/validateRecipes')


// EXPRESS ROUTER INSTANCIATE //
let router = express.Router()

// GET ALL RECIPES  //
router.get('', controller.getAllRecipes)

// GET ONE RECIPE //
router.get('/:id', validateGetRecipe, controller.getOnRecipe)

// CREATE RECIPE //
router.put('/create', upload, validateCreateRecipe, checkTokenMIddleware, controller.createRecipe)

// UPDATE RECIPE //
router.patch('/update', upload, validateUpdateRecipe, checkTokenMIddleware, controller.updateRecipe)

// DELETE RECIPE //
router.delete('/delete/:id', validateDeleteRecipe, checkTokenMIddleware, controller.deleteRecipe)


// EXPORT MODULES
module.exports = router