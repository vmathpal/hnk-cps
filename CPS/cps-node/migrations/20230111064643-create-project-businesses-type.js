"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ProjectBusinessesTypes", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      projectID: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: "Projects",
          key: "id",
        },
      },
      businessID: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: "BusinessTypes",
          key: "id",
        },
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
    await queryInterface.dropTable("ProjectBusinessesTypes");
  },
};
