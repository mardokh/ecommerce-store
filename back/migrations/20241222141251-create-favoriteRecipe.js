'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('favoriteRecipe', {
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
      recipe_id: {
          type: Sequelize.INTEGER(11),
          allowNull: false,
          references: {
              model: 'recipes',
              key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
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
    await queryInterface.dropTable('favoriteRecipe')
    
  }
};