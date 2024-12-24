// DEFINE MODEL //

module.exports = (sequelize, DataTypes) => {
    
    const productImages = sequelize.define('productImages', {
        
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        productId: {
            type: DataTypes.INTEGER(11),
            references: {
                model: 'product',
                key: 'id'
            }
        },
        images: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE,
        },
    }, {freezeTableName: true})

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