// DEFINE MODEL //

module.exports = (sequelize, DataTypes) => {

    const favoriteProduct = sequelize.define('favoriteProduct', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        client_id: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        product_id: {
            type: DataTypes.INTEGER(11),
            references: {
                model: 'product',
                key: 'id'
            }
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE,
        },
    }, {
        freezeTableName: true,
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
        })
    }

    return favoriteProduct
}