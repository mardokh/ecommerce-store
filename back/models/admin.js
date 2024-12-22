// DEFINE MODEL //

module.exports = (sequelize, DataTypes) => {

    const admin = sequelize.define('admin', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        identifiant: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING(64),
            allowNull: false,
            is: /^[0-9a-f]{64}$/i // contrainte on password encoding
        },
    }, {
        freezeTableName: true,
    })

    return admin
}