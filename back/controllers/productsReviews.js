// MODULES IMPORTS //
const db = require('../models')
const ProductsReviews = db.productsReviews
const Product = db.product
const Users = db.users
const sequelize = db.sequelize
const productsNotesLevels = db.productsNotesLevels


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
        await Product.update({ note: 0 }, { where: { id: product_id } }),
        await productsNotesLevels.destroy({where: {product_id: product_id}, force: true})
        return
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

// GET REVIEWS //
exports.getProductReview = async (req, res) => {
    try {
        // Extract product id
        const product_id = parseInt(req.params.id)

        // Get comments & notes
        const productsReviews = await ProductsReviews.findAll({
            where: {product_id},
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
            return res.status(404).json({data: [], message: "Aucun avis pour ce produit", type: "Failed"})
        }

        // Get reveiws levels
        const ProductsNotesLevels = await productsNotesLevels.findAll({where: { product_id: product_id }})

        // Sucessfully response
        return res.status(200).json({data: [{productsReviews, ProductsNotesLevels}], message: "Review obtained", type: "Success"})
    }
    catch (err) {
        return res.status(500).json({data: [], message: 'Database error', error: err.message, stack: err.stack, type: "Failed"})
    }
}

// CREATE REVIEWS //
exports.createProductReview = async (req, res) => {
    try {
        // Extract inputs from request
        const { user_id, product_id, comment, note } = req.body

        // Check if this review already exist
        const review = await ProductsReviews.findOne({where: {user_id, product_id}})
        if (review) {
            return res.status(409).json({data: [], message: 'Vous avez deja commenter se produit', type: "Failed" })
        }

        // Create review
        await ProductsReviews.create({user_id, product_id, comment, note})

        // Calculate review
        await calculateReviews(user_id, product_id)

        // Return success response
        return res.status(201).json({data: [], message: 'Review created', type: "Success" })
    } 
    catch (err) {
        return res.status(500).json({data: [], message: 'Database error', error: err.message, stack: err.stack, type: "Failed"})
    }
}

// UPDATE REVIEW //
exports.updateProductReview = async (req, res) => {
    try {
        // Extract product id & note
        const {user_id, product_id, comment, note} = req.body

        // Check if review exist
        const review = await ProductsReviews.findOne({where: {product_id, user_id}})
        if (!review) {
            return res.status(404).json({data: [], message: "This review do not exist", type: "Failed"})
        }

        // Update review
        await ProductsReviews.update({comment, note}, {where: {product_id, user_id}})

        // Calculate reviews
        await calculateReviews(user_id, product_id)

        // Success response
        return res.status(204).json({data: [], message: 'Avis modifier avec succées', type: "Success"})
    }
    catch (err) {
        return res.status(500).json({data: [], message: 'Database error', error: err.message, stack: err.stack, type: "Failed"})
    }
}

// DELETE REVIEWS //
exports.deleteProductReview = async (req, res) => {
    try {
        // Extract reviews id
        const reviewId = parseInt(req.params.reviewId)
        const user_id = parseInt(req.params.userId)
        const product_id = parseInt(req.params.productId)

        // Check if reviews exist
        const reveiws = await ProductsReviews.findOne({where: {id: reviewId}})
        if (!reveiws) {
            return res.status(404).json({data: [], message: 'Reviews not found', type: "Failed"})
        }

        // Delete reviwes
        await ProductsReviews.destroy({where: {id: reviewId}, force: true})

        // Calculate reviews
        await calculateReviews(user_id, product_id)

        // Success responses
        return res.status(204).json({data: [], message: "Review deleted", type: "Success"})
    }
    catch (err) {
        return res.status(500).json({data: [], message: 'Database error', error: err.message, stack: err.stack, type: "Failed"})
    }
}