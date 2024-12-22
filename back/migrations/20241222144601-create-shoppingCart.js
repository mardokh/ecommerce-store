'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {

  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('shopping_cart', {
      id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      client_id: {
          type: Sequelize.STRING(255),
          allowNull: false,
      },
      product_id: {
          type: Sequelize.INTEGER(11),
          allowNull: false,
          references: {
              model: 'products',
              key: 'id'
          },
          onDelete: 'CASCADE',
          onDelete: 'SET NULL'
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('shopping_cart')
  }
};
