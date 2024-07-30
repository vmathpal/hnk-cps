"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addColumn("ProjectExpenses", "lineExtID", {
      allowNull: true,
      type: Sequelize.INTEGER,
      references: {
        model: "lineExtensions",
        key: "id",
      },
    }),
      queryInterface.addColumn("ProjectExpenses", "expenseID", {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: "Expenses",
          key: "id",
        },
        after: "lineExtID",
      });
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
