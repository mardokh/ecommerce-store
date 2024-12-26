// DEFINE MODEL //

module.exports = (sequelize, DataTypes) => {

    const shoppingCart = sequelize.define('shopping_cart', {
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
    }, {freezeTableName: true})

    // Define association
    shoppingCart.associate = (models) => {
        shoppingCart.belongsTo(models.product, {
            foreignKey: 'product_id', 
            as: 'shopping_cart_product', 
            onDelete: 'CASCADE'
        })
        models.product.hasMany(shoppingCart, {
            foreignKey: 'product_id', 
            
        })
    }

    return shoppingCart
}