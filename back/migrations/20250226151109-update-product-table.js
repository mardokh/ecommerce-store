'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn('product', 'category', 'category_id');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameColumn('product', 'category_id', 'category');
  }
};
