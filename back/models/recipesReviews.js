// DEFINE MODEL //

module.exports = (sequelize, DataTypes) => {

    const recipesReviews = sequelize.define('recipesReviews', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        recipe_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
        },
        comment: {
            type: DataTypes.STRING(255)
        },
        note: {
            type: DataTypes.INTEGER(11)
        }
    }, {freezeTableName: true})

    // Define association
    recipesReviews.associate = (models) => {
        recipesReviews.belongsTo(models.users, {
            foreignKey: 'user_id', 
            as: 'user_profil', 
            onDelete: 'CASCADE'
        })
        models.users.hasOne(recipesReviews, {
            foreignKey: 'user_id', 
            onDelete: 'SET NULL'
        })
    }

    return recipesReviews
}