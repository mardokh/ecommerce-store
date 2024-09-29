// MODULES IMPORTS //
const DB = require('../db.config')
const FavoriteRecipe = DB.favoriteRecipe
const Recipe = DB.recipe
const { v4: uuidv4 } = require('uuid')


// GLOBALS VARIABLS //
const cookieName = 'client_id_favorites_recipes'


// ADD FAVORITE RECIPE //
exports.addFavoriteRecipe = async (req, res) => {

    try {
        // IF CLIENT HAS COOKIE WITH SPECIFIED COOKIENAME //
        if (req.cookies && req.cookies[cookieName]) {

            // Extract cookie 
            const client_id = req.cookies[cookieName]

            // Extract id
            const recipe_id = req.body.id

            // Check params
            if (!recipe_id) {
                return res.status(400).json({ message: 'Recipe ID is missing in the request body !' })
            }

            // Check if the recipe is already a favorite for this client
            const existingFavorite = await FavoriteRecipe.findOne({ where: { client_id, recipe_id } });
            
            if (!existingFavorite) {
                // Create favorite recipe
                await FavoriteRecipe.create({ client_id, recipe_id });
            }

            // Fetch the recipe
            const recipe = await Recipe.findByPk(recipe_id);

            // Increment favorites occurrences
            recipe.favrcp += 1;

            // Save the updated recipe
            await recipe.save();

            // Get favorites recipes
            const favorites_recipes = await FavoriteRecipe.findAll({ where: { client_id: client_id } })

            // Check recipe
            if (!favorites_recipes) {
                return res.status(404).json({ message: 'Favorites recipes not found' })
            }

            // Send successfully 
            return res.json({ data: favorites_recipes })
        }

        else {
            // IF CLIENT DOESN'T HAVE COOKIE WITH SPECIFIED COOKIENAME //
            const recipeId = req.body.id

            // Check params
            if (!recipeId) {
                return res.status(400).json({ message: 'Recipe ID is missing in the request body' })
            }

            // Create clien id
            const clientId = uuidv4()

            // Set entrie
            const client_favoriteRecipe = {
                client_id: clientId,
                recipe_id: recipeId
            }

            // Create favorite recipe
            await FavoriteRecipe.create(client_favoriteRecipe)

            // Fetch the recipe
            const recipe = await Recipe.findByPk(recipeId);

            // Increment favorites occurrences
            recipe.favrcp += 1;

            // Save the updated recipe
            await recipe.save();

            // Get favorites recipes
            const favorites_recipes = await FavoriteRecipe.findAll({ where: { client_id: clientId } })

            // Check recipe
            if (!favorites_recipes) {
                return res.status(404).json({ message: 'Favorites recipes not found' })
            }

            // Create & send cookie
            res.cookie(cookieName, clientId, { maxAge: 30 * 24 * 60 * 60 * 1000})

            // Send Successfully 
            return res.json({ data: favorites_recipes })
        }
    }
    catch (err) {
        return res.status(500).json({ message: 'Database error !', error: err.message, stack: err.stack })
    }
}


// GET FAVORITES RECIPES //
exports.getFavoritesRecipes = async (req, res) => {

    try {
        // CHECK IF CLIENT HAS COOKIE WITH SPECIFIED COOKIENAME
        if (req.cookies && req.cookies[cookieName]) {

            // Extract client id 
            const client_id = req.cookies[cookieName]

            // Get all favorites recipes from database
            const favoritesRecipes = await FavoriteRecipe.findAll({where: {client_id: client_id},
                include: [{ model: Recipe, attributes: ['id', 'name', 'image'], as: 'favorite_recipe' }]})
            
            // IF THE CLIENT HASN'T ADDED ANY FAVORITE
            if (!favoritesRecipes.length > 0) {
                return res.json({ data: "aucune recette favorite" })
            }
            else {
                // Send favorites recipes to the client
                return res.json({ data: favoritesRecipes })
            }    
        }
        else {
            // IF CLIENT DOESN'T HAVE CLIENT HAS COOKIE WITH SPECIFIED COOKIENAME
            return res.json({ data: "aucune recette favorite" })
        }
    }
    catch (err) {
        return res.status(500).json({ message: 'Database error !', error: err.message, stack: err.stack })
    }
}


// DELETE FAVORITE RECIPE //
exports.deleteFavoritesRecipes = async (req, res) => {

    try {
        // Extract id
        const favoriteRecipeId = req.params.id

        // Delete favorite recipe
        await FavoriteRecipe.destroy({where: {recipe_id: favoriteRecipeId}, force: true})

        // Send successfully
        return res.json({data: 'favorite recipe deleted successfully'})
    }
    catch (err) {
        return res.status(500).json({ message: 'Database error!', error: err.message, stack: err.stack })
    }
}

// GET FAVORITES RECIPES COUNT //
exports.getFavoritesRecipesCount = async (req, res) => {

    try {
        // IF CLIENT HAS COOKIE WITH SPECIFIED COOKIENAME //
        if (req.cookies && req.cookies[cookieName]) {

            // Extract cookie 
            const client_id = req.cookies[cookieName]

            // Get favorites recipes
            const favorites_recipes = await FavoriteRecipe.findAll({ where: { client_id: client_id } })

            // Check if favorites recipes exists
            if (!favorites_recipes) {
                return res.status(404).json({ message: 'Favorites recipes not found' })
            }

            // Send successfully 
            return res.json({ data: favorites_recipes })
        }
    }
    catch (err) {
        return res.status(500).json({ message: 'Database error!', error: err.message, stack: err.stack })
    }
}