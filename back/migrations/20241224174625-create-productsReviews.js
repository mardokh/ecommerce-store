'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('productsReviews', {
      id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
          type: Sequelize.INTEGER(11),
          references: {
              model: 'users',
              key: 'id'
          },
          onDelete: 'CASCADE',
      },
      product_id: {
          type: Sequelize.INTEGER(11),
          allowNull: false,
      },
      comment: {
          type: Sequelize.STRING(255)
      },
      note: {
          type: Sequelize.INTEGER(11)
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
    await queryInterface.dropTable('productsReviews')
  }
};