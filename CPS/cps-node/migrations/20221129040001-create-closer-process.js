"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("CloserProcesses", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userID: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
      },
      projectID: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: "Projects",
          key: "id",
        },
      },
      scopeofevaluation: {
        type: Sequelize.TEXT,
      },
      explanation: {
        type: Sequelize.TEXT,
      },
      whatweworked: {
        type: Sequelize.TEXT,
      },
      whatwedidnotwork: {
        type: Sequelize.TEXT,
      },
      eventhighlights: {
        type: Sequelize.TEXT,
      },
      objective: {
        type: Sequelize.TEXT,
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
    await queryInterface.dropTable("CloserProcesses");
  },
};
