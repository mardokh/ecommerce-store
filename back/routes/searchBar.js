//  MODULES IMPORTATION //
const express = require('express')
const controller = require('../controllers/searchBar')
const {validateSearch} = require('../middlewares/validateSearchBar')


// EXPRESS ROUTER INSTANCIATE //
let router = express.Router()

// GET SEARCHED PRODUCT //
router.get('', validateSearch, controller.searchBar)


// EXPORTS //
module.exports = router