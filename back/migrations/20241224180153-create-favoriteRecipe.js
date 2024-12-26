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
          references: {
            model: 'recipe',
            key: 'id'
          },
          onDelete: 'CASCADE',
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