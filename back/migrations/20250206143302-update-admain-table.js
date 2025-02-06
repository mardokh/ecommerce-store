'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('admin', 'identifiant');

    await queryInterface.addColumn('admin', 'firstName', {
      type: Sequelize.STRING(255),
      allowNull: false,
    });

    await queryInterface.addColumn('admin', 'lastName', {
      type: Sequelize.STRING(255),
      allowNull: false,
    });

    await queryInterface.addColumn('admin', 'email', {
      type: Sequelize.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('admin', 'firstName');
    await queryInterface.removeColumn('admin', 'lastName');
    await queryInterface.removeColumn('admin', 'email');
    await queryInterface.addColumn('admin', 'identifiant', {
      type: Sequelize.STRING(255),
      allowNull: false,
    });
  },
};
