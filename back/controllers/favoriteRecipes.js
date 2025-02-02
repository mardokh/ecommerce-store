// MODULES IMPORTS //
const db = require('../models')
const FavoriteRecipe = db.favoriteRecipe
const Recipe = db.recipe
const { v4: uuidv4 } = require('uuid')

// COOKIE NAME //
const cookieName = 'client_id_favorites_recipes'


// GET FAVORITES //
exports.getFavoritesRecipes = async (req, res) => {
    try {
        // Extract client id 
        const client_id = req.cookies?.[cookieName]

        // Get favorites
        const favorites = await FavoriteRecipe.findAll({where: {client_id: client_id},
            include: [{ model: Recipe, attributes: ['id', 'name', 'image'], as: 'favorite_recipe' }]})
        
        // Check if favorties exist
        if (!favorites.length > 0) {
            return res.status(404).json({data: [], message: "Aucun favori", type: "Failed"})
        }

        // Success response
        return res.status(200).json({data: favorites, message: "Favorites obtained", type: "Success"})
    }
    catch (err) {
        return res.status(500).json({data: [], message: 'Database error', error: err.message, stack: err.stack, type: "Failed"})
    }
}

// CREATE FAVORITE //
exports.createFavoriteRecipe = async (req, res) => {
    try {
        // Extract recipe id
        const recipe_id = req.body.id

        // Extract client id
        let client_id = req.cookies?.[cookieName]

        // If no client_id create a new one
        if (!client_id) {
            client_id = uuidv4()
            res.cookie(cookieName, client_id, { maxAge: 7 * 24 * 60 * 60 * 1000 })
        }

        // Check if favorite already exists
        const favorite = await FavoriteRecipe.findOne({ where: { client_id, recipe_id } })
        if (favorite) {
            return res.status(409).json({data: [], message: 'This favorite already exist', type: 'Failed'})
        }

        // Create favorite recipe
        await FavoriteRecipe.create({ client_id, recipe_id })

        // Increment favorites count for the recipe
        await Recipe.increment('favrcp', { by: 1, where: { id: recipe_id } })

        // Success response
        return res.status(201).json({data: [], message: 'Favorite created', type: 'Success'})
    } 
    catch (err) {
        return res.status(500).json({data: [], message: 'Database error', error: err.message, stack: err.stack, type: 'Failed'})
    }
}

// DELETE FAVORITE //
exports.deleteFavoriteRecipe = async (req, res) => {
    try {
        // Extract recipe id
        const recipe_id = parseInt(req.params.id)

        // Check if favorite exist
        const favorite = await FavoriteRecipe.findOne({where: {recipe_id}})
        if (!favorite) {
            return res.status(404).json({data: [], message: "This favorite do not exist", type: "Failed"})
        }

        // Delete favorite
        await FavoriteRecipe.destroy({where: {recipe_id}, force: true})

        // Success response
        return res.status(201).json({data: [], message: "Favorite deleted", type: "Success"})
    }
    catch (err) {
        return res.status(500).json({data: [], message: 'Database error', error: err.message, stack: err.stack, type: "Failed"})
    }
}