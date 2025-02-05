// MODULES IMPORTS //
const db = require('../models')
const FavoriteProduct = db.favoriteProduct
const Product = db.product
const { v4: uuidv4 } = require('uuid')

// COOKIE NAME //
const cookieName = 'client_id_favorites_products'


// GET FAVORITES //
exports.getFavoritesProducts = async (req, res) => {
    try {
        // Extract client id 
        const client_id = req.cookies?.[cookieName]

        if(!client_id) {
            return res.status(404).json({data: [], message: "Aucun favoris", type: "Failed"})
        }

        // Get favorites
        const favorites = await FavoriteProduct.findAll({where: {client_id},
            include: [{ model: Product, attributes: ['id', 'name', 'price', 'image'], as: 'favorite_product' }]})
        
        // Check if favorties exist
        if (!favorites.length > 0) {
            return res.status(404).json({data: [], message: "Aucun favoris", type: "Failed"})
        }
        
        // Success response
        return res.status(200).json({data: favorites, message: "Favorites obtained", type: "Success"})
    }
    catch (err) {
        return res.status(500).json({data: [], message: 'Database error', error: err.message, stack: err.stack, type: "Failed"})
    }
}

// CREATE FAVORITE //
exports.createFavoriteProduct = async (req, res) => {
    try {
        // Extract product id
        const product_id = req.body.id

        // Extract client id
        let client_id = req.cookies?.[cookieName]

        // If no client_id create a new one
        if (!client_id) {
            client_id = uuidv4()
            res.cookie(cookieName, client_id, { maxAge: 7 * 24 * 60 * 60 * 1000 })
        }

        // Check if this favorite already exists
        const favorite = await FavoriteProduct.findOne({ where: { client_id, product_id } })
        if (favorite) {
            return res.status(409).json({data: [], message: 'This favorite product already exists', type: 'Failed'})
        }

        // Create favorite product
        await FavoriteProduct.create({ client_id, product_id })

        // Increment favorites count for this product
        await Product.increment('favprd', { by: 1, where: { id: product_id } })

        // Success response
        return res.status(201).json({data: [], message: 'favorite created', type: 'Success'})
    } 
    catch (err) {
        return res.status(500).json({data: [], message: 'Database error', error: err.message, stack: err.stack, type: 'Failed'})
    }
}

// DELETE FAVORITE //
exports.deleteFavoriteProduct = async (req, res) => {
    try {
        // Extract product id
        const product_id = parseInt(req.params.id)

        // Check if favorite exist
        const favorite = await FavoriteProduct.findOne({where: {product_id}})
        if (!favorite) {
            return res.status(404).json({data: [], message: "This favorite do not exist", type: "Failed"})
        }

        // Delete favorite
        await FavoriteProduct.destroy({where: {product_id}, force: true})

        // Success response
        return res.status(201).json({data: [], message: "favorite product deleted", type: "Success"})
    }
    catch (err) {
        return res.status(500).json({data: [], message: 'Database error', error: err.message, stack: err.stack, type: "Failed"})
    }
}