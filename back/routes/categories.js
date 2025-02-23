//  MODULES IMPORTATION //
const express = require('express')
const controller = require('../controllers/categories')


// EXPRESS ROUTER INSTANCIATE //
let router = express.Router()

// GET CATEGORIES NAMES //
router.get('/names', controller.getCategoriesNames)


// EXPORT MODULES
module.exports = router