// DEFINE MODEL  //

module.exports = (sequelize, DataTypes) => {
    const product = sequelize.define('product', {
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
        details: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: ''
        },
        price: {
            type: DataTypes.DECIMAL(30, 2),
            allowNull: false,
        },
        note: {
            type: DataTypes.DECIMAL(10, 1),
            allowNull: true,
            defaultValue: 0
        },
        favprd: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0
        },
        image: {
            type: DataTypes.STRING(255),
            allowNull: false,
            defaultValue: ''
        },
        images: {
            type: DataTypes.STRING(255),
            allowNull: true,
            defaultValue: ''
        },
        category_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
        }
    }, {
        freezeTableName: true
    })

    return product
}