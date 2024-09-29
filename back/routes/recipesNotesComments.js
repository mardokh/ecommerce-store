//  MODULES IMPORTS //
const express = require('express')
const controller = require('../controllers/recipesNotesComments')
//const checkTokenMIddleware = require('../jsonwebtoken/check_jwt_endPoints')



// EXPRESS ROUTER INSTANCIATE //
let router = express.Router()


// GET ALL REVEIWS //
router.get('', controller.getRecipesNotesComments)

// ADD REVEIW //
router.put('/add', controller.addRecipesNotesComments)

// UPDATE REVEIW //
router.patch('/update', controller.updateRecipesNotesComments)

// DELETE REVIWE
router.delete('/delete/:id', controller.deleteRecipesNotesComments)



// EXPORTS //
module.exports = router