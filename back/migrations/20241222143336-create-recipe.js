'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {

  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('recipe', {
      id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
          type: Sequelize.STRING(255),
          allowNull: false,
          defaultValue: ''
      },
      ingredients: {
          type: Sequelize.TEXT,
          allowNull: false,
          defaultValue: ''
      },
      directions: {
          type: Sequelize.TEXT,
          allowNull: false,
          defaultValue: ''
      },
      favrcp: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0
      },
      image: {
          type: Sequelize.STRING(255),
          allowNull: false,
          defaultValue: ''
      },
      note: {
          type: Sequelize.DECIMAL(10, 1),
          allowNull: true,
          defaultValue: 0
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
    await queryInterface.dropTable('recipe')
  }
};
