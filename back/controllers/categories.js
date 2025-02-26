const db = require('../models')
const Categories = db.categories


// GET CATEGORIES //
exports.getCategoriesNames = async (req, res) => {
    try {
        // Get categories
        const categ = await Categories.findAll()

        // Check if categories exist
        if (categ.length === 0) {
            return res.status(404).json({data: [], message: "Aucune categorie dans la liste", type: "Failed"})
        }

        // Success response
        return res.status(200).json({data: categ, message: "Categories obtained", type: "Success"})
    }
    catch (err) {
        return res.status(500).json({data: [], message: 'Database error', error: err.message, stack: err.stack, type: "Failed"})
    }
}

// GET CATEGORIES BY FILTER //
exports.getCategoriesFilter = async (req, res) => {
    try {
        // Extract category name
        const category = req.query.category

        // Get category
        const categ = await Categories.findAll({where: {category}})

        // Check if category exist
        if (!categ) {
            return res.status(404).json({data: [], message: "Aucun produits pour cette categorie", type: "Failed"})
        }
    } 
    catch (err) {
        return res.status(500).json({data: [], message: 'Database error', error: err.message, stack: err.stack, type: "Failed"})
    }
}

// CREATE CATEGORY //
exports.createCategorie = async (req, res) => {
    try {
        // Extract input
        const {category} = req.body

        // Check if category exist
        const categExist = await Categories.findOne({where: {name: category}})
        if (categExist !== null) {
            return res.status(409).json({data: [], message: 'Cette categorie exist deja', type: "Failed"})
        }

        // Create category
        await Categories.create({name: category})

        // Success response
        return res.status(201).json({data: [], message: 'Categorie cree avec success', type: "Success"})
    }
    catch (err) {
        return res.status(500).json({data: [], message: 'Database error', error: err.message, stack: err.stack, type: "Failed"})
    }
}