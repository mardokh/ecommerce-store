// MODULES IMPORTS //
const DB = require('../db.config')
const ShoppingCart = DB.shoppingCart
const Product = DB.product
const { v4: uuidv4 } = require('uuid')
const {Sequelize} = require('sequelize')


// GLOBALS VARIABLS //
const cookieName = 'client_id_shopping_carts'


// ADD SHOPPING CARTS //
exports.addShoppingCart = async (req, res) => {

    try {
        // IF CLIENT HAS (client_id) COOKIE //
        if (req.cookies && req.cookies[cookieName]) {

            // Extract cookie 
            const client_id = req.cookies[cookieName]

            // Extract id
            const product_id = req.body.id;

            // Extract quantity
            const quantity = req.body.quantity || 1;
            
            // Check params
            if (!product_id || !quantity) {
                return res.status(400).json({ message: 'Missing params !' });
            }

            // Set entrie
            const client_cart = {
                client_id: client_id,
                product_id: product_id
            }

            // Entries loop creator
            for (let i = 0; i < quantity; i++) {
                await ShoppingCart.create(client_cart);
            }

            // Get product
            const product = await Product.findOne({ where: { id: product_id } })

            // Check products
            if (!product) {
                return res.status(404).json({ message: 'Product not found' })
            }

            // Send successfully 
            return res.json({ data: product })
        }

        else {
            // IF CLIENT DOESN'T HAVE (client_id) COOKIE //
            const productId = req.body.id

            // Check params
            if (!productId) {
                return res.status(400).json({ message: 'Product ID is missing in the request body' })
            }

            // Set entrie
            const clientId = uuidv4()
            const clientCart = {
                client_id: clientId,
                product_id: productId
            }

            // Create entrie
            await ShoppingCart.create(clientCart)

            // Get product
            const product = await Product.findOne({ where: { id: productId } })

            // Check product
            if (!product) {
                return res.status(404).json({ message: 'Product not found' })
            }

            // Create & send cookie
            res.cookie(cookieName, clientId, { maxAge: 30 * 24 * 60 * 60 * 1000})

            // Send Successfully 
            return res.json({ data: product })
        } 
    }
    catch (err) {
        return res.status(500).json({ message: 'Database error from shopping cart!', error: err.message, stack: err.stack })
    }
}


// GET SHOPPING CARTS //
exports.getShoppingCart = async (req, res) => {

    try {
        // CHECK IF CLIENT HAS (client_id) COOKIE
        if (req.cookies && req.cookies[cookieName]) {

            // Extract client id 
            const client_id = req.cookies[cookieName]

            // Fetch unique products added by the client and count of entries
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

            // IF THE CLIENT HASN'T ADDED ANY PRODUCTS
            if (!clientShopping.length > 0) {
                //return res.json({ data: "vous n'avez ajouté aucun produit" })
                return res.status(404).json({data: "Vous n'avez jouté aucun article."})
            }
            else {
                // Send products and counts to the client
                return res.json({ data: clientShopping })
            }
        } 

        else {
            // IF CLIENT DOESN'T HAVE (client_id) COOKIE
            return res.status(404).json({ data: "Vous n'avez jouté aucun article" })
        }
    } 
    catch (err) {
        return res.status(500).json({ message: 'Database error!', error: err.message, stack: err.stack })
    }
}


// DELETE ONE SHOPPING CART //
exports.deleteShoppingCart = async (req, res) => {

    try {
        // Extract id
        const productId = req.params.id
        
        // Delete product
        await ShoppingCart.destroy({where: {product_id: productId}, force: true, limit: 1})

        // Send successfully
        return res.json({data: 'product deleted successfully'})
    }
    catch(err) {
        return res.status(500).json({ message: 'Database error!', error: err.message, stack: err.stack })
    }
}


// DELETE SOME SHOPPING CARTS //
exports.deleteSomeShoppingCarts = async (req, res) => {

    try {
        // Extract id
        const productId = req.params.id
        
        // Delete product
        await ShoppingCart.destroy({where: {product_id: productId}})

        // Send successfully
        return res.json({data: 'product deleted successfully'})
    }
    catch(err) {
        return res.status(500).json({ message: 'Database error!', error: err.message, stack: err.stack })
    }
}


// GET SHOPPING CARTS COUNT //
exports.getShoppingCartsCount = async (req, res) => {

    try {
        // CHECK IF CLIENT HAS (client_id) COOKIE
        if (req.cookies && req.cookies[cookieName]) {

            // Extract client id 
            const client_id = req.cookies[cookieName]

            // Get shopping carts
            const clientShopping = await ShoppingCart.findAll({where: {client_id: client_id}})

            // Check if have shopping carts
            if (!clientShopping) {
                return res.status(404).json({message: 'No shopping carts found !'})
            }

            // Send successfully
            return res.json({data: clientShopping})
        }
    }
    catch (err) {
        return res.status(500).json({ message: 'Database error!', error: err.message, stack: err.stack })
    }
}  