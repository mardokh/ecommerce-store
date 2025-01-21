// MODULES IMPORT //
const db = require('../models')
const Recipe = db.recipe
const fs = require('fs')
const path = require('path')


// GET RECIPES //
exports.getAllRecipes = async (req, res) => {

    try {
        // Get recipes
        const recipes = await Recipe.findAll()

        // Check if recipes exist
        if (recipes.length === 0) {
            return res.status(404).json({data: [], message: "section vide", type: "Failed"})
        }

        // Send successfully 
        return res.status(200).json({data: recipes, message: "recipe obtained", type: "Success"})
    }
    catch (err) {
        return res.status(500).json({data: [], message: 'Database error', error: err.message, stack: err.stack, type: "Failed"})
    }
}

// GET RECIPE //
exports.getOnRecipe = async (req, res) => {

    try {
        // Extract id from request
        const id = parseInt(req.params.id)

        // Validate product id
        if (!id || !Number.isInteger(id)) {
            return res.status(400).json({data: [], message: 'Invalid or missing id', type: 'Failed'})
        }

        // Get product from database
        const recipe = await Recipe.findOne({where: {id}})

        // Check if recipe exist
        if (!recipe) {
            return res.status(404).json({data: [], message: 'This recipe do not exist', type: "Failed"})
        }

        // Send recipe successfully
        return res.status(200).json({data: recipe, message: "", type: "Success"}) 
    }
    catch (err) {
        return res.status(500).json({data: [], message: 'Database error', error: err.message, stack: err.stack, type: "Failed"}) 
    }
}

// CREATE RECIPE //
exports.createRecipe = async (req, res) => {
    try {
        // Body request destructuring
        const {name, ingredients, directions} = req.body

        // Extract image path
        const image = req.file.filename

        // Check inputs
        if (!name || !ingredients || !directions || !image) {
            return res.status(400).json({data: [], message: 'Missing or invalid input', type: "Failed"})
        }

        // Check if recipe exist
        const recipe = await Recipe.findOne({where: {name: name}})
        if (recipe !== null) {
            return res.status(409).json({data: [], message: 'This recipe already exist', type: "Failed"})
        }

        // Create recipe
        await Recipe.create({name, ingredients, directions, image})

        // Send success response
        return res.status(201).json({data: [], message: 'Recipe created', type: "Success"})
    }
    catch (err) {
        return res.status(500).json({data: [], message: 'Database error', error: err.message, stack: err.stack, type: "Failed"})
    }
}

// UPDATE RECIPE //
exports.updateRecipe = async (req, res) => {
    
    try {
        // Body request destructuring
        const { id, name, ingredients, directions, image } = req.body

        // Validate id
        if (!id || !Number.isInteger(id)) {
            return res.status(400).json({data: [], message: 'Invalid or missing id', type: 'Failed'})
        }

        // Validate inputs
        if (!name, !ingredients, !directions, !image) {
            return res.status(400).json({data: [], message: 'Invalid or missing inputs', type: 'Failed'})
        }

        // Check if recipe exist
        const recipe = await Recipe.findOne({ where: {id}})
        if (!recipe) {
            return res.status(404).json({data: [], message: 'This recipe do not exist', type: 'Failed'})
        }

        // Set image input
        let newImage = image
        if (req.file && req.file.filename) {
            newImage = req.file.filename
        }

        // Update recipe
        await Recipe.update({name, ingredients, directions, image: newImage},{where: {id}})

        // Send successfully
        return res.status(204).json({data: [], message: 'Recipe updated', type: "Success"})
    } 
    catch (err) {
        return res.status(500).json({data: [], message: 'Database error', error: err.message, type: "Failed"})
    }
}

// DELETE RECIPE //
exports.deleteRecipe = async (req, res) => {

    try {
        // Extract recipe id from request
        const id = parseInt(req.params.id)

        // Check if recipe exist
        const recipe = await Recipe.findOne({ where: {id}})
        if (recipe === null) {
            return res.status(404).json({data: [], message: 'Recipe not found', type: "Failed"})
        }

        // Delete recipe
        await Recipe.destroy({where: {id: id}, force: true})

        // Get the image filename associated
        const imageFilename = recipe.image

        // Delete the associated image file
        fs.unlinkSync(path.join(__dirname, '..', 'uploads', imageFilename))
            
        // Send successfully response
        return res.status(204).json({data: [], message: 'Recipe deleted', type: "Success"})
    }
    catch (err) {
        return res.status(500).json({data: [], message: 'Database error', error: err.message, stack: err.stack, type: "Failed"})
    }
}


