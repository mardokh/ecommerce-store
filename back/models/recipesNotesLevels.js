// DEFINE MODEL //

module.exports = (sequelize, DataTypes) => {

    const recipesNotesLevels = sequelize.define('recipesNotesLevels', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        recipe_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
        },
        level_1: {
            type: DataTypes.INTEGER(11)
        },
        level_2: {
            type: DataTypes.INTEGER(11)
        },
        level_3: {
            type: DataTypes.INTEGER(11)
        },
        level_4: {
            type: DataTypes.INTEGER(11)
        },
        level_5: {
            type: DataTypes.INTEGER(11)
        },
        totale_note: {
            type: DataTypes.DECIMAL(10, 1),
            defaultValue: 0
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

    return recipesNotesLevels
}