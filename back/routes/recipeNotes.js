//  MODULES IMPORTS //
const express = require('express')
const controller = require('../controllers/recipeNotes')
const multer = require('multer')


// EXPRESS ROUTER INSTANCIATE //
let router = express.Router()

// MULTER INSTANCIATE //
const upload = multer()

// ADD RECIPE NOTE //
router.put('/add', upload.none(), controller.addRecipeNote)


// EXPORTS //
module.exports = router