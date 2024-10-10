// MODULES IMPORTS //
const DB = require('../db.config')
const RecipesReviews = DB.recipesReviews
const Recipe = DB.recipe
const Users = DB.users
const sequelize = DB.sequelize
const recipesNotesLevels = DB.recipesNotesLevels


// RECALCULATE REVIEWS//
const recalculateReviews = async () => {

    // Calculate notes and insert into recipes tables
    const result = await RecipesReviews.findAll({
        attributes: [
            'recipe_id',
            [sequelize.fn('SUM', sequelize.literal('CASE WHEN `note` = 1 THEN 1 ELSE 0 END')), 'note_count_for_1'],
            [sequelize.fn('SUM', sequelize.literal('CASE WHEN `note` = 2 THEN 1 ELSE 0 END')), 'note_count_for_2'],
            [sequelize.fn('SUM', sequelize.literal('CASE WHEN `note` = 3 THEN 1 ELSE 0 END')), 'note_count_for_3'],
            [sequelize.fn('SUM', sequelize.literal('CASE WHEN `note` = 4 THEN 1 ELSE 0 END')), 'note_count_for_4'],
            [sequelize.fn('SUM', sequelize.literal('CASE WHEN `note` = 5 THEN 1 ELSE 0 END')), 'note_count_for_5'],
        ],
        where: {},
        group: ['recipe_id'],
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
    
        // Update recipe note in the recipes table
        await Recipe.update({ note: total_notes }, { where: { id: row.recipe_id } })
    
        // Update recipe review levels
        await recipesNotesLevels.update({
            level_1: (row.dataValues.note_count_for_1 / total_notes_count) * 100, 
            level_2: (row.dataValues.note_count_for_2 / total_notes_count) * 100, 
            level_3: (row.dataValues.note_count_for_3 / total_notes_count) * 100, 
            level_4: (row.dataValues.note_count_for_4 / total_notes_count) * 100, 
            level_5: (row.dataValues.note_count_for_5 / total_notes_count) * 100,
            totale_note: total_notes
        }, {where: {recipe_id: row.recipe_id}})
    
        return {
            recipe_id: row.recipe_id,
            total_notes: total_notes,
        }
    })
    
    // Wait for all the updates to complete
    await Promise.all(noteResult)

}


// ADD REVIEWS //
exports.addRecipesReviews = async (req, res) => {

    try {

        // Extract recipe id & note
        const {user_id, recipe_id, comment, note} = req.body

        // Check inputs 
        if (!user_id || !recipe_id || !comment || !note) {
            return res.status(400).json({message: 'Missing inputs in request body !'})
        }

        // check if the client has already rated this recipe
        const recipeNoted = await RecipesReviews.findAll({where: {user_id: user_id, recipe_id: recipe_id}})

        if (recipeNoted.length !== 0) {
            return res.status(409).json({message: 'Vous avez deja commenter ce porduit'})
        }
        else {
            // Create recipe note
            await RecipesReviews.create({
            user_id: user_id,
            recipe_id: recipe_id,
            comment: comment,
            note: note
            })
        }

        // Calculate notes and insert into recipes tables
        const result = await RecipesReviews.findAll({
            attributes: [
                'recipe_id',
                [sequelize.fn('SUM', sequelize.literal('CASE WHEN `note` = 1 THEN 1 ELSE 0 END')), 'note_count_for_1'],
                [sequelize.fn('SUM', sequelize.literal('CASE WHEN `note` = 2 THEN 1 ELSE 0 END')), 'note_count_for_2'],
                [sequelize.fn('SUM', sequelize.literal('CASE WHEN `note` = 3 THEN 1 ELSE 0 END')), 'note_count_for_3'],
                [sequelize.fn('SUM', sequelize.literal('CASE WHEN `note` = 4 THEN 1 ELSE 0 END')), 'note_count_for_4'],
                [sequelize.fn('SUM', sequelize.literal('CASE WHEN `note` = 5 THEN 1 ELSE 0 END')), 'note_count_for_5'],
            ],
            where: {},
            group: ['recipe_id'],
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
        
            // Update recipe note in the recipes table
            await Recipe.update({ note: total_notes }, { where: { id: row.recipe_id } })

            // Check if reveiws levels exist
            const reviwesLevels = await recipesNotesLevels.findOne({where: {recipe_id: recipe_id}})
        
            // Create or update recipe review levels
            if (reviwesLevels === null) {
                await recipesNotesLevels.create({
                    user_id: user_id,
                    recipe_id: row.recipe_id,
                    level_1: (row.dataValues.note_count_for_1 / total_notes_count) * 100, 
                    level_2: (row.dataValues.note_count_for_2 / total_notes_count) * 100, 
                    level_3: (row.dataValues.note_count_for_3 / total_notes_count) * 100, 
                    level_4: (row.dataValues.note_count_for_4 / total_notes_count) * 100, 
                    level_5: (row.dataValues.note_count_for_5 / total_notes_count) * 100,
                    totale_note: total_notes
                })
            }
            else {
                await recipesNotesLevels.update({
                    level_1: (row.dataValues.note_count_for_1 / total_notes_count) * 100, 
                    level_2: (row.dataValues.note_count_for_2 / total_notes_count) * 100, 
                    level_3: (row.dataValues.note_count_for_3 / total_notes_count) * 100, 
                    level_4: (row.dataValues.note_count_for_4 / total_notes_count) * 100, 
                    level_5: (row.dataValues.note_count_for_5 / total_notes_count) * 100,
                    totale_note: total_notes
                }, {where: {recipe_id: row.recipe_id}})
            }
        
            return {
                recipe_id: row.recipe_id,
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
exports.getRecipesReviews = async (req, res) => {

    try {
        // Extract recipe id
        const recipe_id = req.query.recipeId

        // Get comments & notes
        const recipesReviews = await RecipesReviews.findAll({
            where: { recipe_id: recipe_id },
            include: [
                { 
                    model: Users, 
                    attributes: ['firstName', 'lastName'], 
                    as: 'user_profil' 
                }
            ]
        })

        // Check if comments exists
        if (!recipesReviews.length > 0) {
            return res.status(404).json({ message: "aucun commentaire" })
        }

        // Get reveiws levels
        const RecipesNotesLevels = await recipesNotesLevels.findAll({where: { recipe_id: recipe_id}})

        // Sucessfully response
        return res.json({ data: [{recipesReviews, RecipesNotesLevels}] })

    }
    catch (err) {
        return res.status(500).json({ message: 'Database error !', error: err.message, stack: err.stack })
    }
}


// UPDATE REVIEW //
exports.updateRecipesReviews = async (req, res) => {

    try {
        // Extract recipe id & note
        const {user_id, comment, note} = req.body

        // Check inputs 
        if (!user_id || !comment || !note) {
            return res.status(400).json({message: 'Missing inputs in request body !'})
        }

        // Update review
        await RecipesReviews.update(req.body, {where: {user_id: user_id}})

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
exports.deleteRecipesReviews = async (req, res) => {

    try {
        // Extract reviews id
        const reviewId = parseInt(req.params.id)

        // Check reviews id
        if (!reviewId) {
            return res.json({message: 'Missing or incorrect id !'})
        }

        // Get reveiws
        const reveiws = await RecipesReviews.findOne({where: {id: reviewId}})

        // Check if reviews exist
        if (reveiws === null) {
            return res.status(404).json({message: 'reveiws not found !'})
        }

        // Delete reviwes
        await RecipesReviews.destroy({where: {id: reviewId}, force: true})

        // Recalculate reviews
        await recalculateReviews()

        // Sucessfully responses
        return res.status(204).json({message: "commentaire supprimer avec succes"})

    }
    catch (err) {
        return res.status(500).json({ message: 'Database error !', error: err.message, stack: err.stack })
    }
}