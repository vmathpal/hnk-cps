"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("discussions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      ProjectID: {
        type: Sequelize.STRING,
      },
      senderID: {
        type: Sequelize.STRING,
      },
      message: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("discussions");
  },
};
