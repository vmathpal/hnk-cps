"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("ProjectBrands", "volumeWithoutLastBudget", {
        allowNull: true,
        type: Sequelize.STRING,
        after: "fy",
      }),
      queryInterface.addColumn("ProjectBrands", "volumeWithoutBudget", {
        allowNull: true,
        type: Sequelize.STRING,
        after: "fy",
      }),
      queryInterface.addColumn("ProjectBrands", "volumeWithLastBudget", {
        allowNull: true,
        type: Sequelize.DOUBLE,
        after: "fy",
      }),
      queryInterface.addColumn("ProjectBrands", "volumeWithBudget", {
        allowNull: true,
        type: Sequelize.DOUBLE,
        after: "fy",
      }),
      queryInterface.addColumn("ProjectBrands", "contributeLastBudget", {
        allowNull: true,
        type: Sequelize.DOUBLE,
        after: "fy",
      }),
      queryInterface.addColumn("ProjectBrands", "contributeBudget", {
        allowNull: true,
        type: Sequelize.DOUBLE,
        after: "fy",
      }),
      queryInterface.addColumn("ProjectBrands", "othContributeLastBudget", {
        allowNull: true,
        type: Sequelize.DOUBLE,
        after: "fy",
      }),
      queryInterface.addColumn("ProjectBrands", "othContributeBudget", {
        allowNull: true,
        type: Sequelize.DOUBLE,
        after: "fy",
      }),
      queryInterface.addColumn("ProjectBrands", "lastProjectVolumeInc", {
        allowNull: true,
        type: Sequelize.DOUBLE,
        after: "fy",
      }),
      queryInterface.addColumn("ProjectBrands", "budgetVolumeIncrease", {
        allowNull: true,
        type: Sequelize.DOUBLE,
        after: "fy",
      }),
      queryInterface.addColumn("ProjectBrands", "lastProjectTotalIncrement", {
        allowNull: true,
        type: Sequelize.DOUBLE,
        after: "fy",
      }),
      queryInterface.addColumn("ProjectBrands", "budgetProjectTotalIncrement", {
        allowNull: true,
        type: Sequelize.DOUBLE,
        after: "fy",
      }),
      queryInterface.addColumn("ProjectBrands", "totalLastOthContribute", {
        allowNull: true,
        type: Sequelize.DOUBLE,
        after: "fy",
      }),
      queryInterface.addColumn("ProjectBrands", "totalBudgetOthContribute", {
        allowNull: true,
        type: Sequelize.DOUBLE,
        after: "fy",
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
