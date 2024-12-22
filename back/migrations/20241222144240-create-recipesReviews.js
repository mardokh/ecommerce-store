'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('recipesReviews', {
      id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
          type: Sequelize.INTEGER(11),
          allowNull: false,
          references: {
              model: 'users',
              key: 'id'
          },
          onDelete: 'CASCADE',
          onDelete: 'SET NULL',
      },
      recipe_id: {
          type: Sequelize.INTEGER(11),
          allowNull: false,
      },
      comment: {
          type: Sequelize.STRING(255)
      },
      note: {
          type: Sequelize.INTEGER(11)
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('recipesReviews')
  }
};
