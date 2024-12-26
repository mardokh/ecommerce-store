// DEFINE MODEL  //

module.exports = (sequelize, DataTypes) => {
    const recipe = sequelize.define('recipe', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            defaultValue: ''
        },
        ingredients: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: ''
        },
        directions: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: ''
        },
        favrcp: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0
        },
        image: {
            type: DataTypes.STRING(255),
            allowNull: false,
            defaultValue: ''
        },
        note: {
            type: DataTypes.DECIMAL(10, 1),
            allowNull: true,
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
    }, {
        freezeTableName: true,
    })

    return recipe
}
