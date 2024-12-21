// MODULES IMPORTS //
const {DataTypes} = require('sequelize')


// DEFINE MODEL //
module.exports = (sequelize) => {

    const favoriteProduct = sequelize.define('favoriteProduct', {
        id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        client_id: {
            type: DataTypes.STRING(255)
        },
        product_id: {
            type: DataTypes.INTEGER(11),
            references: {
                model: 'products',
                key: 'id'
            }
        }
    })

    // Define associations
    favoriteProduct.associate = (models) => {
        favoriteProduct.belongsTo(models.product, {
            foreignKey: 'product_id',
            as: 'favorite_product',
            onDelete: 'CASCADE'
        })
        models.product.hasOne(favoriteProduct, {
            foreignKey: 'product_id',
            onDelete: 'SET NULL' // delete this
        })
    }

    return favoriteProduct
}