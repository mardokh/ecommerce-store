'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('product', {
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
      details: {
          type: Sequelize.STRING(255),
          allowNull: false,
          defaultValue: ''
      },
      price: {
          type: Sequelize.DECIMAL(30, 2),
          allowNull: false,
      },
      note: {
          type: Sequelize.DECIMAL(10, 1),
          allowNull: true,
          defaultValue: 0
      },
      favprd: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0
      },
      image: {
          type: Sequelize.STRING(255),
          allowNull: false,
          defaultValue: ''
      },
      images: {
          type: Sequelize.STRING(255),
          allowNull: true,
          defaultValue: ''
      },
      createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
      },
      updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTbale('product')
  }
};
