'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {

  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('productImages', {
      id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      productId: {
          type: Sequelize.INTEGER(11),
          references: {
              model: 'product',
              key: 'id'
          },
          onDelete: 'CASCADE',
          onDelete: 'SET NULL'
      },
      images: {
          type: Sequelize.STRING(255),
          allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('productImages')
  }
};