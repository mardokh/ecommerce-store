//  MODULES IMPORTATION //
const express = require('express')
const controller = require('../controllers/SearchBar')


// EXPRESS ROUTER INSTANCIATE //
let router = express.Router()


// GET SEARCHED PRODUCT //
router.get('', controller.searchBar)



// EXPORTS //
module.exports = router