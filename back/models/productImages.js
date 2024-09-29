// MODULES IMPORTATION  //
const {DataTypes} = require('sequelize')


module.exports = (sequelize) => {
    return productImages = sequelize.define('productImages', {
        id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        productId: {
            type: DataTypes.INTEGER(11),
            references: {
                model: 'products',
                key: 'id'
            }
        },
        images: {
            type: DataTypes.STRING(255),
        }
    })
}