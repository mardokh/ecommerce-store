// MODULES IMPORTATION  //
const {DataTypes} = require('sequelize')


// DEFINE MODEL //
module.exports = (sequelize) => {

    const productsReviews = sequelize.define('productsReviews', {
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
        product_id: {
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
    productsReviews.associate = (models) => {
        productsReviews.belongsTo(models.users, {
            foreignKey: 'user_id',
            as: 'user_profil', 
            onDelete: 'CASCADE'
        })
        models.users.hasOne(productsReviews, {
            foreignKey: 'user_id', 
            onDelete: 'SET NULL'
        })
    }

    return productsReviews
}