// DEFINE MODEL //

module.exports = (sequelize, DataTypes) => {
    
    const favoriteRecipe = sequelize.define('favoriteRecipe', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        client_id: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        recipe_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            references: {
                model: 'recipes',
                key: 'id'
            }
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE,
        },
    }, {
        freezeTableName: true,
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