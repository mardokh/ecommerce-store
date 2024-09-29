// MODULES IMPORTATION  //
const {DataTypes} = require('sequelize')


// DEFINE MODEL //
module.exports = (sequelize) => {
    return shoppingCart = sequelize.define('shopping_cart', {
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
}