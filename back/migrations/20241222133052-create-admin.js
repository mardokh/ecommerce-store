'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {

  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('admin', {
      id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      identifiant: {
          type: Sequelize.STRING(255),
          allowNull: false,
      },
      password: {
          type: Sequelize.STRING(64),
          allowNull: false,
          is: /^[0-9a-f]{64}$/i // contrainte on password encoding
      },
      })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('admin')
  }
};
