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
            defaultValue: 0
        },
        image: {
            type: DataTypes.STRING(255),
            allowNull: false,
            defaultValue: ''
        },
        note: {
            type: DataTypes.DECIMAL(10, 1),
            defaultValue: 0
        }
    }, {
        paranoid: true,
        freezeTableName: true,
    })

    return recipe
}
