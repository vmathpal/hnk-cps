"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ChangeRequests", {
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
      projectBrandID: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: "ProjectBrands",
          key: "id",
        },
      },
      allocationPercent: {
        type: Sequelize.DOUBLE,
      },
      allocation: {
        type: Sequelize.DOUBLE,
      },
      budgetRef: {
        type: Sequelize.STRING,
      },
      budgetAmount: {
        type: Sequelize.DOUBLE,
      },
      fy: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable("ChangeRequests");
  },
};
