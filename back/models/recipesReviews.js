// MODULES IMPORTATION  //
const {DataTypes} = require('sequelize')


// DEFINE MODEL //
module.exports = (sequelize) => {

    return recipesReviews = sequelize.define('recipesReviews', {
        id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER(11),
            references: {
                model: 'users',
                key: 'id'
            }
        },
        recipe_id: {
            type: DataTypes.INTEGER(11)
        },
        comment: {
            type: DataTypes.STRING(255)
        },
        note: {
            type: DataTypes.INTEGER(11)
        }
    })
}