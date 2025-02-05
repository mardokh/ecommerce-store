// MODULES IMPORTS //
const db = require('../models')
const ShoppingCart = db.shopping_cart
const Product = db.product
const { v4: uuidv4 } = require('uuid')
const {Sequelize} = require('sequelize')

// COOKIE NAME //
const cookieName = 'client_id_shopping_carts'


// GET CARTS //
exports.getShoppingCart = async (req, res) => {

    try {
        // Extract client id 
        const client_id = req.cookies?.[cookieName]

        // If do not have client_id
        if (!client_id) {
            return res.status(404).json({data: [], message: "Votre panier est vide", type: "Failed"})
        }

        // Get carts
        const clientShopping = await ShoppingCart.findAll({
            where: { client_id: client_id },
            attributes: [
                'product_id',
                [Sequelize.fn('COUNT', Sequelize.col('product_id')), 'product_count'],
                [Sequelize.fn('SUM', Sequelize.col('price')), 'total_price']
            ],
            include: [{ model: Product, attributes: ['id', 'name', 'price', 'image'], as: 'shopping_cart_product' }],
            group: ['product_id']
        })

        // Check if carts exist
        if (!clientShopping.length > 0) {
            return res.status(404).json({data: [], message: "Votre panier est vide", type: "Failed"})
        }
        
        // Success response
        return res.status(200).json({data: clientShopping, message: "Cart obtained", type: "Success"})
    } 
    catch (err) {
        return res.status(500).json({data: [], message: 'Database error!', error: err.message, stack: err.stack, type: "Failed"})
    }
}

// CREATE CART //
exports.createShoppingCart = async (req, res) => {

    try {
        // Extract id
        const product_id = req.body.id
    
        // Extract cookie
        let client_id = req.cookies?.[cookieName]

        // Extract quantity
        const quantity = req.body.quantity || 1

        // If no client_id create a new one
        if (!client_id) {
            client_id = uuidv4()
            res.cookie(cookieName, client_id, { maxAge: 7 * 24 * 60 * 60 * 1000 })
        }

        // Entries loop creator
        for (let i = 0; i < quantity; i++) {
            await ShoppingCart.create({client_id, product_id});
        }

        // Success response 
        return res.status(201).json({data: [], message: "Cart created", type: "Success"})
    }
    catch (err) {
        return res.status(500).json({data: [], message: 'Database error from shopping cart', error: err.message, stack: err.stack, type: "Failed"})
    }
}

// DELETE CART //
exports.deleteShoppingCart = async (req, res) => {

    try {
        // Extract params
        const limitOne = req.params.limit
        const product_id = parseInt(req.params.id)

        // Check if cart exist
        const cart = await ShoppingCart.findOne({where: {product_id}})
        if (cart === null) {
            return res.status(404).json({data: [], message: 'This cart do not exist', type: "Failed"})
        }
        
        // Delete product
        await ShoppingCart.destroy({where: {product_id}, force: true, limit: limitOne === 'limit' ? 1 : 0})

        // Send successfully
        return res.json({data: [], message: "Cart deleted", type: "Success"})
    }
    catch(err) {
        return res.status(500).json({data: [], message: 'Database error', error: err.message, stack: err.stack, type: "Failed"})
    }
}