// DEFINE MODEL //

module.exports = (sequelize, DataTypes) => {

    const users = sequelize.define('users', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        firstName: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: 'email',
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING(64),
            allowNull: false,
            is: /^[0-9a-f]{64}$/i // contrainte on password encoding
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

    return users
}