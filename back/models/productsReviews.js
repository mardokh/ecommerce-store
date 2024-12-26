// DEFINE MODEL //

module.exports = (sequelize, DataTypes) => {

    const productsReviews = sequelize.define('productsReviews', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER(11),
            references: {
                model: 'users',
                key: 'id'
            }
        },
        product_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
        },
        comment: {
            type: DataTypes.STRING(255)
        },
        note: {
            type: DataTypes.INTEGER(11)
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
    productsReviews.associate = (models) => {
        productsReviews.belongsTo(models.users, {
            foreignKey: 'user_id',
            as: 'user_profil', 
            onDelete: 'CASCADE'
        })
        models.users.hasOne(productsReviews, {
            foreignKey: 'user_id', 
            
        })
    }

    return productsReviews
}