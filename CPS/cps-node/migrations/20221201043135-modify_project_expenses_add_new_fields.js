"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("ProjectExpenses", "actualExpenseBudget", {
        allowNull: true,
        type: Sequelize.STRING,
        after: "fy",
      }),
      queryInterface.addColumn("ProjectExpenses", "varianceBudget", {
        allowNull: true,
        type: Sequelize.STRING,
        after: "fy",
      }),
      queryInterface.addColumn("ProjectExpenses", "expenseRemark", {
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
