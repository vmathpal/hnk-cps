"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Projects", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      userID: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
      },
      projectType: {
        type: Sequelize.STRING,
      },
      department: {
        type: Sequelize.STRING,
      },
      costStartDate: {
        type: Sequelize.DATE,
      },
      costEndDate: {
        type: Sequelize.DATE,
      },
      sellingStartDate: {
        type: Sequelize.DATE,
      },
      sellingEndDate: {
        type: Sequelize.DATE,
      },
      projectVolume: {
        type: Sequelize.STRING,
      },
      remark: {
        type: Sequelize.TEXT,
      },
      specificMeasure: {
        type: Sequelize.TEXT,
      },
      criticalSucess: {
        type: Sequelize.TEXT,
      },
      launchCriteria: {
        type: Sequelize.TEXT,
      },

      rational: {
        type: Sequelize.TEXT,
      },
      strategy: {
        type: Sequelize.TEXT,
      },
      forConsumers: {
        type: Sequelize.TEXT,
      },
      executionPlan: {
        type: Sequelize.TEXT,
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
    await queryInterface.dropTable("Projects");
  },
};
