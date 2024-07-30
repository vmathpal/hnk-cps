"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("BusinessTypes", "baseChannel", {
        allowNull: true,
        type: Sequelize.TEXT,
        after: "status",
      }),
      queryInterface.addColumn("BusinessTypes", "bizBaseDisc", {
        allowNull: true,
        type: Sequelize.TEXT,
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
