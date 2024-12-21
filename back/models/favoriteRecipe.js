// MODULES IMPORTS //
const {DataTypes} = require('sequelize')


// DEFINE MODEL //
module.exports = (sequelize) => {
    
    const favoriteRecipe = sequelize.define('favoriteRecipe', {
        id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        client_id: {
            type: DataTypes.STRING(255)
        },
        recipe_id: {
            type: DataTypes.INTEGER(11),
            references: {
                model: 'recipes',
                key: 'id'
            }
        }
    })

    // Define association
    favoriteRecipe.associate = (models) => {
        favoriteRecipe.belongsTo(models.recipe, {
            foreignKey: 'recipe_id',
            as: 'favorite_recipe', 
            onDelete: 'CASCADE' 
        })
        models.recipe.hasOne(favoriteRecipe, {
            foreignKey: 'recipe_id',
            onDelete: 'SET NULL'
        })
    }

    return favoriteRecipe
}