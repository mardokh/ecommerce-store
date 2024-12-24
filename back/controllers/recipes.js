// MODULES IMPORT //
const db = require('../models')
const Recipe = db.recipe
const fs = require('fs')
const path = require('path')


// GET ALL RECIPES //
exports.getAllRecipes = async (req, res) => {

    try {
        // Get all recipes from table
        const recipes = await Recipe.findAll()

        // Check if find recipes
        if (recipes.length === 0) {
            return res.status(404).json({data: "section vide"})
        }

        // Send successfully 
        return res.json({data: recipes})
    }
    catch (err) {
        return res.status(500).json({message: 'Database error !', error: err.message, stack: err.stack})
    }
}


// GET ONE RECIPE //
exports.getOnRecipe = async (req, res) => {

    try {
        // Extract id from request
        const recipeId = parseInt(req.params.id)

        // Check id validity
        if (!recipeId) {
            return res.status(400).json({message: 'Missing id params !'})
        }

        // Get product from database
        const recipe = await Recipe.findOne({where: {id: recipeId}})

        // Check if recipe exist
        if (recipe === null) {
            return res.status(404).json({message: 'This recipe do not exist !'})
        }

        // Send recipe successfully
        return res.json({data: recipe}) 
    }
    catch (err) {
        return res.status(500).json({message: 'Database error !', error: err.message, stack: err.stack}) 
    }
}


// PUT RECIPE //
exports.putRecipe = async (req, res) => {
    try {
        // Body request destructuring
        const {name, ingredients, directions} = req.body

        // Extract image path
        const image = req.file.filename

        // Check inputs
        if (!name || !ingredients || !directions || !image) {
            return res.status(400).json({message: 'Missing input !'})
        }

        // Set data inputs
        const inputs = {name: name, ingredients: ingredients, directions: directions, image: image}

        // Check if recipe exist
        const recipe = await Recipe.findOne({where: {name: name}})

        if (recipe !== null) {
            return res.status(409).json({message: `this product : ${name} is already exist !`})
        }

        // Create recipe
        await Recipe.create(inputs)

        // Send successfully
        return res.status(201).json({message: 'Recipe successfully creating'})
    }
    catch (err) {
        return res.status(500).json({message: 'Database error !', error: err.message, stack: err.stack})
    }
}

// UPDATE RECIPE //
exports.updateRecipe = async (req, res) => {
    
    try {
        // Body request destructuring
        const { id, name, ingredients, directions, image } = req.body

        // Check id validity
        if (!id) {
            return res.status(400).json({ message: 'Missing id params !' })
        }

        // Check if recipe exist
        const recipe = await Recipe.findOne({ where: {id: id}})

        if (recipe === null) {
            return res.status(404).json({ message: 'This recipe do not exist !' })
        }

        // Set image input
        let newImage = image
        if (req.file && req.file.filename) {
            newImage = req.file.filename
        }

        // Set inputs
        const updatedRecipe = {
            name,
            ingredients,
            directions,
            image: newImage,
        }

        // Update recipe
        await Recipe.update(updatedRecipe, {where: {id: id}})

        // Send successfully
        return res.json({ message: 'Recipe updated successfully' })
    } 
    catch (err) {
        return res.status(500).json({ message: 'Database error !', error: err.message })
    }
}


// DELETE RECIPE //
exports.deleteRecipe = async (req, res) => {

    try {
        // Extract recipe id from request
        const recipeId = parseInt(req.params.id)

        // Get recipe from database 
        const recipe = await Recipe.findOne({ where: { id: recipeId } })

        // Check if recipe exist or not
        if (recipe === null) {
            return res.status(404).json({ message: 'Recipe not found !' })
        }

        // Delete recipe
        await Recipe.destroy({ where: { id: recipeId }, force: true })

        // Get the image filename associated
        const imageFilename = recipe.image

        // Delete the associated image file
        fs.unlinkSync(path.join(__dirname, '..', 'uploads', imageFilename))
            
        // Send successfully response
        return res.json({ message: 'Recipe and associated image successfully deleted' })
    }
    catch (err) {
        return res.status(500).json({ message: 'Database error !', error: err.message, stack: err.stack })
    }
}


