// MODULES IMPORTS //
const DB = require('../db.config')
const FavoriteProduct = DB.favoriteProduct
const FavoriteRecipe = DB.favoriteRecipe
const { Op } = require('sequelize')
const cron = require('node-cron')


// AUTO DATA DELETE FROM TABLES ALL DAYS AT MIDNIGHT//
cron.schedule('0 0 * * *', async () => {
    try {
        const oneWeekAgo = new Date()
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

        // favoritesProducts table
        await FavoriteProduct.destroy({
            where: {
                createdAt: {
                    [Op.lt]: oneWeekAgo
                }
            }
        })

        // favoritesRecipes table
        await FavoriteRecipe.destroy({
            where: {
                createdAt: {
                    [Op.lt]: oneWeekAgo
                }
            }
        })

    } catch (error) {
        console.error('Error in scheduled task:', error)
    }
})