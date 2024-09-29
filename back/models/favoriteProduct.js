// MODULES IMPORTS //
const {DataTypes} = require('sequelize')


// DEFINE MODEL //
module.exports = (sequelize) => {
    return favoriteProduct = sequelize.define('favoriteProduct', {
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
