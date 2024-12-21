// MODULES IMPORTATION  //
const {DataTypes} = require('sequelize')


// DEFINE MODEL //
module.exports = (sequelize) => {

    const recipesReviews = sequelize.define('recipesReviews', {
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

    // Define association
    recipesReviews.associate = (models) => {
        recipesReviews.belongsTo(models.users, {
            foreignKey: 'user_id', 
            as: 'user_profil', 
            onDelete: 'CASCADE'
        })
        models.users.hasOne(recipesReviews, {
            foreignKey: 'user_id', 
            onDelete: 'SET NULL'
        })
    }

    return recipesReviews
}