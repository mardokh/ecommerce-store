// MODULES IMPORTS //
const {DataTypes} = require('sequelize')


// DEFINE MODEL //
module.exports = (sequelize) => {
    return users = sequelize.define('users', {
        id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        firstName: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(255),
            unique: 'email',
            allowNull: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING(64),
            allowNull: false,
            is: /^[0-9a-f]{64}$/i // contrainte on password encoding
        }
    })
}