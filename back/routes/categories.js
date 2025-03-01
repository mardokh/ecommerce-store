//  MODULES IMPORTATION //
const express = require('express')
const controller = require('../controllers/categories')


// EXPRESS ROUTER INSTANCIATE //
let router = express.Router()

// GET CATEGORIES NAMES //
router.get('/names', controller.getCategoriesNames)

// CREATE CATEGORY //
router.put('/category', controller.createCategory)

// DELETE CATEGORY //
router.delete('/category/:id', controller.deleteCategory)


// EXPORT MODULES
module.exports = router