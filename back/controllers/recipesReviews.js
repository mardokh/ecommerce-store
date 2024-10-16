// MODULES IMPORTS //
const DB = require('../db.config')
const RecipesReviews = DB.recipesReviews
const Recipe = DB.recipe
const Users = DB.users
const sequelize = DB.sequelize
const recipesNotesLevels = DB.recipesNotesLevels


// RECALCULATE REVIEWS//
const calculateReviews = async (user_id, recipe_id) => {

    // Get ratings occurrences sum for each rating level
    const result = await RecipesReviews.findOne({
        attributes: [
            'recipe_id',
            [sequelize.fn('SUM', sequelize.literal('CASE WHEN `note` = 1 THEN 1 ELSE 0 END')), 'note_count_for_1'],
            [sequelize.fn('SUM', sequelize.literal('CASE WHEN `note` = 2 THEN 1 ELSE 0 END')), 'note_count_for_2'],
            [sequelize.fn('SUM', sequelize.literal('CASE WHEN `note` = 3 THEN 1 ELSE 0 END')), 'note_count_for_3'],
            [sequelize.fn('SUM', sequelize.literal('CASE WHEN `note` = 4 THEN 1 ELSE 0 END')), 'note_count_for_4'],
            [sequelize.fn('SUM', sequelize.literal('CASE WHEN `note` = 5 THEN 1 ELSE 0 END')), 'note_count_for_5'],
        ],
        where: { recipe_id: recipe_id},
        group: ['recipe_id'],
    })

    // Set note to 0 if no reviews exist
    if (!result) {
        await Recipe.update({ note: 0 }, { where: { id: recipe_id } }),
        await recipesNotesLevels.destroy({where: {recipe_id: recipe_id}, force: true})
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

    // Update recipe note in the recipes table
    await Recipe.update({ note: total_notes }, { where: { id: recipe_id } })

    // Check if review rating levels exist
    const reviewLevels = await recipesNotesLevels.findOne({ where: { recipe_id: recipe_id } })

    if (!reviewLevels) {
        // Create new review levels
        await recipesNotesLevels.create({
            user_id,
            recipe_id,
            level_1: (result.dataValues.note_count_for_1 / total_notes_count) * 100,
            level_2: (result.dataValues.note_count_for_2 / total_notes_count) * 100,
            level_3: (result.dataValues.note_count_for_3 / total_notes_count) * 100,
            level_4: (result.dataValues.note_count_for_4 / total_notes_count) * 100,
            level_5: (result.dataValues.note_count_for_5 / total_notes_count) * 100,
            totale_note: total_notes,
        })
    } else {
        // Update existing review levels
        await recipesNotesLevels.update(
            {
                level_1: (result.dataValues.note_count_for_1 / total_notes_count) * 100,
                level_2: (result.dataValues.note_count_for_2 / total_notes_count) * 100,
                level_3: (result.dataValues.note_count_for_3 / total_notes_count) * 100,
                level_4: (result.dataValues.note_count_for_4 / total_notes_count) * 100,
                level_5: (result.dataValues.note_count_for_5 / total_notes_count) * 100,
                totale_note: total_notes,
            },
            { where: { recipe_id: recipe_id } }
        )
    }
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
        const recipeNoted = await RecipesReviews.findOne({where: { user_id: user_id, recipe_id: recipe_id }})

        if (recipeNoted) {
            return res.status(409).json({ message: 'You have already commented on this recipes' })
        }

        // Create recipe review
        await RecipesReviews.create({user_id, recipe_id, comment, note})

        // Calculate review
        await calculateReviews(user_id, recipe_id)
        
        // Send successfully
        return res.status(201).json({ message: 'Review added successfully' })
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
        const RecipesNotesLevels = await recipesNotesLevels.findAll({where: { recipe_id: recipe_id }})

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
        const {user_id, recipe_id, comment, note} = req.body

        console.log(req.body)

        // Check inputs 
        if (!user_id || !comment || !note) {
            return res.status(400).json({message: 'Missing inputs in request body !'})
        }

        // Update review
        await RecipesReviews.update(req.body, {where: {recipe_id: recipe_id, user_id: user_id}})

        // Calculate review
        await calculateReviews(user_id, recipe_id)

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
        const reviewId = parseInt(req.params.reviewId)
        const user_id = parseInt(req.params.userId)
        const recipe_id = parseInt(req.params.recipeId)

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

        // Calculate review
        await calculateReviews(user_id, recipe_id)

        // Sucessfully responses
        return res.status(204).send()
    }
    catch (err) {
        return res.status(500).json({ message: 'Database error !', error: err.message, stack: err.stack })
    }
}