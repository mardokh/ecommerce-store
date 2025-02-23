const db = require('../models')
const Categories = db.categories


// GET CATEGORIES //
exports.getCategoriesNames = async (req, res) => {
    try {
        // Get categories
        const categ = await Categories.findAll()

        if (categ.length === 0) {
            return res.status(404).json({data: [], message: "No categories found", type: "Failed"})
        }

        // Success response
        return res.status(200).json({data: categ, message: "categories obtained", type: "Success"})
    }
    catch (err) {
        return res.status(500).json({data: [], message: 'Database error', error: err.message, stack: err.stack, type: "Failed"})
    }
}