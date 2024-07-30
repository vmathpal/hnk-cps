"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("ProjectBrands", "newAllocation", {
        allowNull: true,
        type: Sequelize.STRING,
        after: "fy",
      }),
      queryInterface.addColumn("ProjectBrands", "newAllocationPercent", {
        allowNull: true,
        type: Sequelize.STRING,
        after: "fy",
      }),
      queryInterface.addColumn("ProjectBrands", "newBudgetAmount", {
        allowNull: true,
        type: Sequelize.STRING,
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
