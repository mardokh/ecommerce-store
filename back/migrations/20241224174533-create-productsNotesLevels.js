'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {

  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('productsNotesLevels', {
      id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      product_id: {
          type: Sequelize.INTEGER(11),
          allowNull: false,
      },
      level_1: {
          type: Sequelize.INTEGER(11)
      },
      level_2: {
          type: Sequelize.INTEGER(11)
      },
      level_3: {
          type: Sequelize.INTEGER(11)
      },
      level_4: {
          type: Sequelize.INTEGER(11)
      },
      level_5: {
          type: Sequelize.INTEGER(11)
      },
      totale_note: {
          type: Sequelize.DECIMAL(10, 1),
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
    await queryInterface.dropTable('productsNotesLevels')
  }
};