// MODULES IMPORTS //
const DB = require('../db.config')
const ProductsReviews = DB.productsReviews
const Product = DB.product
const Users = DB.users
const sequelize = DB.sequelize
const productsNotesLevels = DB.productsNotesLevels


// RECALCULATE REVIEWS//
const calculateReviews = async (user_id, product_id) => {
    
    // Get ratings occurrences sum for each rating level
    const result = await ProductsReviews.findOne({
        attributes: [
            'product_id',
            [sequelize.fn('SUM', sequelize.literal('CASE WHEN `note` = 1 THEN 1 ELSE 0 END')), 'note_count_for_1'],
            [sequelize.fn('SUM', sequelize.literal('CASE WHEN `note` = 2 THEN 1 ELSE 0 END')), 'note_count_for_2'],
            [sequelize.fn('SUM', sequelize.literal('CASE WHEN `note` = 3 THEN 1 ELSE 0 END')), 'note_count_for_3'],
            [sequelize.fn('SUM', sequelize.literal('CASE WHEN `note` = 4 THEN 1 ELSE 0 END')), 'note_count_for_4'],
            [sequelize.fn('SUM', sequelize.literal('CASE WHEN `note` = 5 THEN 1 ELSE 0 END')), 'note_count_for_5'],
        ],
        where: { product_id: product_id },
        group: ['product_id'],
    })

    // Set note to 0 if no reviews exist
    if (!result) {
        await Product.update({ note: 0 }, { where: { id: product_id } })
        return res.status(204).json({message: "commentaire supprimer avec succes"})
    }

    // add up all ratings levels sum
    const total_notes_count =
        Number(result.dataValues.note_count_for_1) +
        Number(result.dataValues.note_count_for_2) +
        Number(result.dataValues.note_count_for_3) +
        Number(result.dataValues.note_count_for_4) +
        Number(result.dataValues.note_count_for_5)

    // multiply each rating level by number of occurrences
    const total_notes =
       (1 * result.dataValues.note_count_for_1 +
        2 * result.dataValues.note_count_for_2 +
        3 * result.dataValues.note_count_for_3 +
        4 * result.dataValues.note_count_for_4 +
        5 * result.dataValues.note_count_for_5) / total_notes_count

    // Update product rating in the products table
    await Product.update({ note: total_notes }, { where: { id: product_id } })

    // Check if review rating levels exist
    const reviewLevels = await productsNotesLevels.findOne({ where: { product_id: product_id } })

    if (!reviewLevels) {
        // Create new review levels
        await productsNotesLevels.create({
            user_id,
            product_id,
            level_1: (result.dataValues.note_count_for_1 / total_notes_count) * 100,
            level_2: (result.dataValues.note_count_for_2 / total_notes_count) * 100,
            level_3: (result.dataValues.note_count_for_3 / total_notes_count) * 100,
            level_4: (result.dataValues.note_count_for_4 / total_notes_count) * 100,
            level_5: (result.dataValues.note_count_for_5 / total_notes_count) * 100,
            totale_note: total_notes,
        })
    } else {
        // Update existing review levels
        await productsNotesLevels.update(
            {
                level_1: (result.dataValues.note_count_for_1 / total_notes_count) * 100,
                level_2: (result.dataValues.note_count_for_2 / total_notes_count) * 100,
                level_3: (result.dataValues.note_count_for_3 / total_notes_count) * 100,
                level_4: (result.dataValues.note_count_for_4 / total_notes_count) * 100,
                level_5: (result.dataValues.note_count_for_5 / total_notes_count) * 100,
                totale_note: total_notes,
            },
            { where: { product_id: product_id } }
        )
    }
}


// ADD REVIEWS //
exports.addProductReview = async (req, res) => {

    try {
        // Extract inputs from request
        const { user_id, product_id, comment, note } = req.body;

        // Validate inputs
        if (!user_id || !product_id || !comment || !note) {
            return res.status(400).json({ message: 'Missing inputs in request body!' })
        }

        // Check if the user already reviewed this product
        const productNoted = await ProductsReviews.findOne({
            where: { user_id: user_id, product_id: product_id },
        })
        if (productNoted) {
            return res.status(409).json({ message: 'You have already commented on this product' })
        }

        // Create new review
        await ProductsReviews.create({ user_id, product_id, comment, note })

        // Calculate review
        await calculateReviews(user_id, product_id)

        // Return success response
        return res.status(201).json({ message: 'Review added successfully' })
    } 
    catch (err) {
        return res.status(500).json({ message: 'Database error!', error: err.message, stack: err.stack })
    }
}


// GET ALL REVIEWS //
exports.getProductReview = async (req, res) => {

    try {
        // Extract product id
        const product_id = req.query.productId

        // Get comments & notes
        const productsReviews = await ProductsReviews.findAll({
            where: { product_id: product_id },
            include: [
                { 
                    model: Users, 
                    attributes: ['firstName', 'lastName'], 
                    as: 'user_profil' 
                }
            ]
        })

        // Check if comments exists
        if (!productsReviews.length > 0) {
            return res.status(404).json({ message: "aucun commentaire" })
        }

        // Get reveiws levels
        const ProductsNotesLevels = await productsNotesLevels.findAll({where: { product_id: product_id}})

        // Sucessfully response
        return res.json({ data: [{productsReviews, ProductsNotesLevels}] })

    }
    catch (err) {
        return res.status(500).json({ message: 'Database error !', error: err.message, stack: err.stack })
    }
}


// UPDATE REVIEW //
exports.updateProductReview = async (req, res) => {

    try {
        // Extract product id & note
        const {user_id, product_id, comment, note} = req.body

        // Check inputs 
        if (!user_id || !comment || !note) {
            return res.status(400).json({message: 'Missing inputs in request body !'})
        }

        // Update review
        await ProductsReviews.update(req.body, {where: {user_id: user_id}})

        // Recalculate reviews
        await calculateReviews(user_id, product_id)

        // Sucessfully response
        return res.json({message: 'avis modifier avec succées'})
        
    }
    catch (err) {
        return res.status(500).json({ message: 'Database error !', error: err.message, stack: err.stack })
    }
}


// DELETE REVIEWS //
exports.deleteProductReview = async (req, res) => {

    try {
        // Extract reviews id
        const reviewId = parseInt(req.params.reviewId)
        const user_id = parseInt(req.params.userId)
        const product_id = parseInt(req.params.productId)

        // Check reviews id
        if (!reviewId || !user_id || !product_id) {
            return res.json({message: 'Missing or incorrect params !'})
        }

        // Get reveiws
        const reveiws = await ProductsReviews.findOne({where: {id: reviewId}})

        // Check if reviews exist
        if (reveiws === null) {
            return res.status(404).json({message: 'reveiws not found !'})
        }

        // Delete reviwes
        await ProductsReviews.destroy({where: {id: reviewId}, force: true})

        // Recalculate reviews
        await calculateReviews(user_id, product_id)

        // Sucessfully responses
        return res.status(204).json({message: "commentaire supprimer avec succes"})

    }
    catch (err) {
        return res.status(500).json({ message: 'Database error !', error: err.message, stack: err.stack })
    }
}