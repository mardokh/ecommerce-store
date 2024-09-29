// MODULES IMPORTS //
const {DataTypes} = require('sequelize')


// DEFINE MODEL //
module.exports = (sequelize) => {
    return favoriteRecipe = sequelize.define('favoriteRecipe', {
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
}