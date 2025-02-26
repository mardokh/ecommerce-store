// DEFINE MODEL  //

module.exports = (sequelize, DataTypes) => {
    const categories = sequelize.define('categories', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            defaultValue: ''
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
        }
    }, {
        freezeTableName: true
    })

    // Define associations
    categories.associate = (models) => {
        models.product.belongsTo(categories, {
            foreignKey: 'category_id',
            as: 'category_product',
        })
        categories.hasMany(models.product, {
            foreignKey: 'category_id',
        })
    }

    return categories
}