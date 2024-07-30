"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("Projects", "OldTotalBudget", {
        allowNull: true,
        type: Sequelize.STRING,
        after: "status",
      }),
      queryInterface.addColumn("Projects", "ChangeStartDate", {
        allowNull: true,
        type: Sequelize.DATE,
        after: "status",
      }),
      queryInterface.addColumn("Projects", "ChangeEndDate", {
        allowNull: true,
        type: Sequelize.DATE,
        after: "status",
      }),
      queryInterface.addColumn("Projects", "ChangeStatus", {
        allowNull: true,
        type: Sequelize.STRING,
        after: "status",
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
