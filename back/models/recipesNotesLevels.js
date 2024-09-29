// MODULES IMPORTATION  //
const {DataTypes} = require('sequelize')


// DEFINE MODEL //
module.exports = (sequelize) => {

    return recipesNotesLevels = sequelize.define('recipesNotesLevels', {
        id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        recipe_id: {
            type: DataTypes.INTEGER(11)
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
    })
}