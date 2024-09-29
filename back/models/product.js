// MODULES IMPORTATION  //
const {DataTypes} = require('sequelize')


module.exports = (sequelize) => {
    return product = sequelize.define('product', {
        id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(255),
            defaultValue: ''
        },
        details: {
            type: DataTypes.STRING(255),
            defaultValue: ''
        },
        price: {
            type: DataTypes.DECIMAL(30, 2),
        },
        note: {
            type: DataTypes.DECIMAL(10, 1),
            defaultValue: 0
        },
        favprd: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        image: {
            type: DataTypes.STRING(255),
            defaultValue: ''
        },
        images: {
            type: DataTypes.STRING(255),
            defaultValue: ''
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {paranoid: true})
}