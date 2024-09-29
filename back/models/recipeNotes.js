// MODULES IMPORTATION  //
const {DataTypes} = require('sequelize')


// DEFINE MODEL //
module.exports = (sequelize) => {
    return recipeNote = sequelize.define('recipe_note', {
        id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        client_id: {
            type: DataTypes.STRING(255),
        },
        recipe_id: {
            type: DataTypes.INTEGER(11)
        },
        note: {
            type: DataTypes.INTEGER(11)
        }
    })
}