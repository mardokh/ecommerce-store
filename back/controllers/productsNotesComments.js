// MODULES IMPORTS //
const DB = require('../db.config')
const ProductsNotesComments = DB.productsNotesComments
const Product = DB.product
const Users = DB.users
const sequelize = DB.sequelize
const productsNotesLevels = DB.productsNotesLevels


// RECALCULATE REVIEWS//
const recalculateReviews = async () => {

    // Calculate notes and insert into products tables
    const result = await ProductsNotesComments.findAll({
        attributes: [
            'product_id',
            [sequelize.fn('SUM', sequelize.literal('CASE WHEN `note` = 1 THEN 1 ELSE 0 END')), 'note_count_for_1'],
            [sequelize.fn('SUM', sequelize.literal('CASE WHEN `note` = 2 THEN 1 ELSE 0 END')), 'note_count_for_2'],
            [sequelize.fn('SUM', sequelize.literal('CASE WHEN `note` = 3 THEN 1 ELSE 0 END')), 'note_count_for_3'],
            [sequelize.fn('SUM', sequelize.literal('CASE WHEN `note` = 4 THEN 1 ELSE 0 END')), 'note_count_for_4'],
            [sequelize.fn('SUM', sequelize.literal('CASE WHEN `note` = 5 THEN 1 ELSE 0 END')), 'note_count_for_5'],
        ],
        where: {},
        group: ['product_id'],
    })

    const noteResult = result.map(async (row) => {
        const total_notes_count = 
            Number(row.dataValues.note_count_for_1) +
            Number(row.dataValues.note_count_for_2) +
            Number(row.dataValues.note_count_for_3) +
            Number(row.dataValues.note_count_for_4) +
            Number(row.dataValues.note_count_for_5)
    
        const total_notes =
           (1 * row.dataValues.note_count_for_1 +
            2 * row.dataValues.note_count_for_2 +
            3 * row.dataValues.note_count_for_3 +
            4 * row.dataValues.note_count_for_4 +
            5 * row.dataValues.note_count_for_5) / total_notes_count
    
        // Update product note in the products table
        await Product.update({ note: total_notes }, { where: { id: row.product_id } })
    
        // Update product review levels
        await productsNotesLevels.update({
            level_1: (row.dataValues.note_count_for_1 / total_notes_count) * 100, 
            level_2: (row.dataValues.note_count_for_2 / total_notes_count) * 100, 
            level_3: (row.dataValues.note_count_for_3 / total_notes_count) * 100, 
            level_4: (row.dataValues.note_count_for_4 / total_notes_count) * 100, 
            level_5: (row.dataValues.note_count_for_5 / total_notes_count) * 100,
            totale_note: total_notes
        }, {where: {product_id: row.product_id}})
    
        return {
            product_id: row.product_id,
            total_notes: total_notes,
        }
    })
    
    // Wait for all the updates to complete
    await Promise.all(noteResult)

}


// ADD REVIEWS //
exports.addProductsNotesComments = async (req, res) => {

    try {

        // Extract product id & note
        const {user_id, product_id, comment, note} = req.body

        // Check inputs 
        if (!user_id || !product_id || !comment || !note) {
            return res.status(400).json({message: 'Missing inputs in request body !'})
        }

        // check if the client has already rated this product
        const productNoted = await ProductsNotesComments.findAll({where: {user_id: user_id, product_id: product_id}})

        if (productNoted.length !== 0) {
            return res.status(409).json({message: 'Vous avez deja commenter ce porduit'})
        }
        else {
            // Create product note
            await ProductsNotesComments.create({
            user_id: user_id,
            product_id: product_id,
            comment: comment,
            note: note
            })
        }

        // Calculate notes and insert into products tables
        const result = await ProductsNotesComments.findAll({
            attributes: [
                'product_id',
                [sequelize.fn('SUM', sequelize.literal('CASE WHEN `note` = 1 THEN 1 ELSE 0 END')), 'note_count_for_1'],
                [sequelize.fn('SUM', sequelize.literal('CASE WHEN `note` = 2 THEN 1 ELSE 0 END')), 'note_count_for_2'],
                [sequelize.fn('SUM', sequelize.literal('CASE WHEN `note` = 3 THEN 1 ELSE 0 END')), 'note_count_for_3'],
                [sequelize.fn('SUM', sequelize.literal('CASE WHEN `note` = 4 THEN 1 ELSE 0 END')), 'note_count_for_4'],
                [sequelize.fn('SUM', sequelize.literal('CASE WHEN `note` = 5 THEN 1 ELSE 0 END')), 'note_count_for_5'],
            ],
            where: {},
            group: ['product_id'],
        })

        const noteResult = result.map(async (row) => {
            const total_notes_count = 
                Number(row.dataValues.note_count_for_1) +
                Number(row.dataValues.note_count_for_2) +
                Number(row.dataValues.note_count_for_3) +
                Number(row.dataValues.note_count_for_4) +
                Number(row.dataValues.note_count_for_5)
        
            const total_notes =
               (1 * row.dataValues.note_count_for_1 +
                2 * row.dataValues.note_count_for_2 +
                3 * row.dataValues.note_count_for_3 +
                4 * row.dataValues.note_count_for_4 +
                5 * row.dataValues.note_count_for_5) / total_notes_count
        
            // Update product note in the products table
            await Product.update({ note: total_notes }, { where: { id: row.product_id } })

            // Check if reveiws levels exist
            const reviwesLevels = await productsNotesLevels.findOne({where: {product_id: product_id}})
        
            // Create or update product review levels
            if (reviwesLevels === null) {
                await productsNotesLevels.create({
                    user_id: user_id,
                    product_id: row.product_id,
                    level_1: (row.dataValues.note_count_for_1 / total_notes_count) * 100, 
                    level_2: (row.dataValues.note_count_for_2 / total_notes_count) * 100, 
                    level_3: (row.dataValues.note_count_for_3 / total_notes_count) * 100, 
                    level_4: (row.dataValues.note_count_for_4 / total_notes_count) * 100, 
                    level_5: (row.dataValues.note_count_for_5 / total_notes_count) * 100,
                    totale_note: total_notes
                })
            }
            else {
                await productsNotesLevels.update({
                    level_1: (row.dataValues.note_count_for_1 / total_notes_count) * 100, 
                    level_2: (row.dataValues.note_count_for_2 / total_notes_count) * 100, 
                    level_3: (row.dataValues.note_count_for_3 / total_notes_count) * 100, 
                    level_4: (row.dataValues.note_count_for_4 / total_notes_count) * 100, 
                    level_5: (row.dataValues.note_count_for_5 / total_notes_count) * 100,
                    totale_note: total_notes
                }, {where: {product_id: row.product_id}})
            }
        
            return {
                product_id: row.product_id,
                total_notes: total_notes,
            }
        })
        
        // Wait for all the updates to complete
        await Promise.all(noteResult)

        // Send successfully
        return res.status(201).json({ message: "commentaire ajouter avec succes"})

    }
    catch (err) {
        return res.status(500).json({ message: 'Database error !', error: err.message, stack: err.stack })
    }
}


// GET ALL REVIEWS //
exports.getProductsNotesComments = async (req, res) => {

    try {
        // Extract product id
        const product_id = req.query.productId

        // Get comments & notes
        const productsNotesComments = await ProductsNotesComments.findAll({
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
        if (!productsNotesComments.length > 0) {
            return res.status(404).json({ message: "aucun commentaire" })
        }

        // Get reveiws levels
        const ProductsNotesLevels = await productsNotesLevels.findAll({where: { product_id: product_id}})

        // Sucessfully response
        return res.json({ data: [{productsNotesComments, ProductsNotesLevels}] })

    }
    catch (err) {
        return res.status(500).json({ message: 'Database error !', error: err.message, stack: err.stack })
    }
}


// UPDATE REVIEW //
exports.updateProductsNotesComments = async (req, res) => {

    try {
        // Extract product id & note
        const {user_id, comment, note} = req.body

        // Check inputs 
        if (!user_id || !comment || !note) {
            return res.status(400).json({message: 'Missing inputs in request body !'})
        }

        // Update review
        await ProductsNotesComments.update(req.body, {where: {user_id: user_id}})

        // Recalculate reviews
        await recalculateReviews()

        // Sucessfully response
        return res.json({message: 'avis modifier avec succées'})
        
    }
    catch (err) {
        return res.status(500).json({ message: 'Database error !', error: err.message, stack: err.stack })
    }
}


// DELETE REVIEWS //
exports.deleteProductsNotesComments = async (req, res) => {

    try {
        // Extract reviews id
        const reviewId = parseInt(req.params.id)

        // Check reviews id
        if (!reviewId) {
            return res.json({message: 'Missing or incorrect id !'})
        }

        // Get reveiws
        const reveiws = await ProductsNotesComments.findOne({where: {id: reviewId}})

        // Check if reviews exist
        if (reveiws === null) {
            return res.status(404).json({message: 'reveiws not found !'})
        }

        // Delete reviwes
        await ProductsNotesComments.destroy({where: {id: reviewId}, force: true})

        // Recalculate reviews
        await recalculateReviews()

        // Sucessfully responses
        return res.status(204).json({message: "commentaire supprimer avec succes"})

    }
    catch (err) {
        return res.status(500).json({ message: 'Database error !', error: err.message, stack: err.stack })
    }
}