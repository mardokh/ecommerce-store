// MODULES IMPORTS // 
const db = require('../models')
const Product = db.product
const productImages = db.productImages
const fs = require('fs')
const path = require('path')
const productsReviews = db.productsReviews
const productsNotesLevels = db.productsNotesLevels


// GET PRODUCTS //
exports.getAllProducts = async (req, res) => {
    try {
        // Get products
        const products = await Product.findAll()

        // Check if products exists
        if (products.length === 0) {
            return res.status(404).json({data: [], message: "section vide", type: "Failed"})
        } 
        
        // Success response
        return res.status(200).json({data: products, message: "products obtained", type: "Success"})
    }
    catch(err) {
        return res.status(500).json({data: [], message: 'Database error', error: err.message, stack: err.stack, type: "Failed"})
    }
}

// GET PRODUCT //
exports.getOneProduct = async (req, res) => {
    try {
        // Extract product id
        const id = parseInt(req.params.id)

        // Get product
        const product = await Product.findOne({where: {id}, 
            include: [{model: productImages, attributes: ['id', 'images'], as: 'product_images'}]})
        
        // Check if product exist
        if (product === null) {
            return res.status(404).json({data: [], message: 'This product do not exist', type: "Failed"})
        }

        // Success response
        return res.status(200).json({data: product, message: "Product obtained", type: "Success"})
    }
    catch(err) {
        return res.status(500).json({data: [], message: 'Database error', error: err.message, stack: err.stack, type: "Failed"})   
    }
}

// CREATE PRODUCT //
exports.createProduct = async (req, res) => {
    try {
        const { name, details, price } = req.body;

        // Retrieve assigned filenames
        const image = req.savedFileNames.image ? req.savedFileNames.image[0] : null;
        const images = req.savedFileNames.images || [];

        // Check if product exists
        const product = await Product.findOne({ where: { name } });
        if (product !== null) {
            return res.status(409).json({ data: [], message: "This product already exists", type: "Failed" });
        }

        // Create product
        const createProduct = await Product.create({ name, details, price, image });

        // Save additional images
        for (const fileName of images) {
            await productImages.create({ productId: createProduct.id, images: fileName });
        }

        return res.status(201).json({ data: [], message: "Product created", type: "Success" });
    } catch (err) {
        return res.status(500).json({ data: [], message: "Database error", error: err.message, stack: err.stack, type: "Failed" });
    }
};

// UPDATE PRODUCT //
exports.updateProduct = async (req, res) => {
    try {
        // Extract inputs        
        const {id, name, details, price, image} = req.body

        // Check if product exist
        const product = await Product.findOne({where: {id}})
        if (product === null) {
            return res.status(404).json({data: [], message: 'This product do not exist', type: "Failed"})
        }

        // Set main image
        let newImage = image
        if (req.savedFileNames.image && req.savedFileNames.image[0]) {
            newImage = req.savedFileNames.image[0]
        }

        // Update product
        await Product.update({name, details, price, image: newImage},{where: {id}})

        // Update secondarys images
        if (req.savedFileNames.images) {
            const newImages = req.savedFileNames.images
            for (const fileName of newImages) {
                await productImages.create({ productId: id, images: fileName });
            }
        }

        // Delete the associated main image file
        const imageFilename = product.image
        if (imageFilename !== newImage) {
            fs.unlinkSync(path.join(__dirname, '..', 'uploads', imageFilename))
        }
       
        // Send success response
        return res.status(204).json({data: [], message: 'Product updated', type: "Success"})   
    }
    catch (err) {
        return res.status(500).json({message: 'Database error', error: err.message, stack: err.stack})
    }
}

// DELETE PRODUCT //
exports.deleteProduct = async (req, res) => {
    try {
        // Extract product id
        const productId = parseInt(req.params.id)

        // Check if product exist
        const product = await Product.findOne({ where: { id: productId } })
        if (product === null) {
            return res.status(404).json({data: [], message: 'This product do not exist', type: "Failed"})
        }

        // Delete main image
        fs.unlinkSync(path.join(__dirname, '..', 'uploads', product.image))

        // Delete socondarys images
        const images = await productImages.findAll({where: {productId: productId}})
        images.map(file => fs.unlinkSync(path.join(__dirname, '..', 'uploads', file.images)))

        // Delete product
        await Product.destroy({ where: { id: productId }, force: true })

        // Delete associated reviews
        await productsReviews.destroy({ where: {product_id: productId}, force: true })

        // Delete associated reviews levels
        await productsNotesLevels.destroy({ where: {product_id: productId}, force: true })

        // Send successfully response
        return res.status(204).json({data: [], message: 'Product deleted', type: "Success"})
    }
    catch (err) {
        return res.status(500).json({ message: 'Database error', error: err.message, stack: err.stack })
    }
}

// DELETE SECONDARY IMAGE //
exports.deleteSecondaryImage = async (req, res) => {
    try {
        // Extract image id
        const imageId = parseInt(req.params.id)

        // Check id params
        if (!imageId || !Number.isInteger(imageId)) {
            return res.status(400).json({data: [], message: 'Invalid or missing image id', type: "Failed"})
        }

        // Get image
        const image = await productImages.findOne({where: {id: imageId}})

        // Delete associated image
        fs.unlinkSync(path.join(__dirname, '..', 'uploads', image.images))

        // Delete image
        await productImages.destroy({where: {id: imageId}, force: true})

        // Successfully response
        return res.status(204).json({data: [], message: 'Image deleted', type: "Success"})

    }
    catch (err) {
        return res.status(500).json({data: [], message: 'Database error', error: err.message, stack: err.stack, type: "Failed"})
    }
}