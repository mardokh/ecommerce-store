// MODULES IMPORTATION  //
const {DataTypes} = require('sequelize')


module.exports = (sequelize) => {
    
    const productImages = sequelize.define('productImages', {
        
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

    // Define association
    productImages.associate = (models) => {
        productImages.belongsTo(models.product, {
            foreignKey: 'productId',
            onDelete: 'CASCADE' 
        })
        models.product.hasMany(productImages, {
            foreignKey: 'productId',
            as: 'product_images',
            onDelete: 'SET NULL' 
        })
    }

    return productImages
}