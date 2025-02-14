'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('product', 'details', {
      type: Sequelize.TEXT,
      allowNull: false,
      defaultValue: ''
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('product', 'details', {
      type: Sequelize.STRING(255),
      allowNull: false,
      defaultValue: ''
    });
  }
};
