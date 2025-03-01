'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('product', 'category_id', {
      type: Sequelize.INTEGER(11),
      allowNull: false,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('product', 'category_id', {
      type: Sequelize.STRING(255),
      allowNull: false,
    });
  }
};
