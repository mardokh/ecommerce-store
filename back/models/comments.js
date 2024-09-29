// MODULES IMPORTS //
const {DataTypes} = require('sequelize')


// DEFINE MODEL //
module.exports = (sequelize) => {
    return comments = sequelize.define('comments', {
        id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        comment: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER(11),
            references: {
                model: 'users',
                key: 'id'
            }
        }
    })
}