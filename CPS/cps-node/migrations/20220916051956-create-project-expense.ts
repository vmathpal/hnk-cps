"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ProjectExpenses", {
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
      brandID: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: "Brands",
          key: "id",
        },
      },
      costCenterID: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: "CostCenters",
          key: "id",
        },
      },
      expenses: {
        type: Sequelize.STRING,
      },
      scoa: {
        type: Sequelize.STRING,
      },
      lastProject: {
        type: Sequelize.DOUBLE,
      },
      budget: {
        type: Sequelize.DOUBLE,
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
    await queryInterface.dropTable("ProjectExpenses");
  },
};
