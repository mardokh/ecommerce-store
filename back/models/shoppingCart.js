// MODULES IMPORTATION  //
const {DataTypes} = require('sequelize')


// DEFINE MODEL //
module.exports = (sequelize) => {

    const shoppingCart = sequelize.define('shopping_cart', {
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

    // Define association
    shoppingCart.assoaciate = (models) => {
        shoppingCart.belongsTo(models.product, {
            foreignKey: 'product_id', 
            as: 'shopping_cart_product', 
            onDelete: 'CASCADE'
        })
        models.product.hasMany(shoppingCart, {
            foreignKey: 'product_id', 
            onDelete: 'SET NULL'
        })
    }

    return shoppingCart
}