"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("Projects", "NewCostStartDate", {
        allowNull: true,
        type: Sequelize.DATE,
        after: "status",
      }),
      queryInterface.addColumn("Projects", "NewCostEndDate", {
        allowNull: true,
        type: Sequelize.DATE,
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
