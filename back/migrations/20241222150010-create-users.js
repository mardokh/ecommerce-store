'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      firstName: {
          type: Sequelize.STRING(255),
          allowNull: false,
      },
      lastName: {
          type: Sequelize.STRING(255),
          allowNull: false,
      },
      email: {
          type: Sequelize.STRING(255),
          allowNull: false,
          unique: 'email',
          validate: {
              isEmail: true
          }
      },
      password: {
          type: Sequelize.STRING(64),
          allowNull: false,
          is: /^[0-9a-f]{64}$/i // contrainte on password encoding
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
    await queryInterface.dropTable('users')
  }
};
