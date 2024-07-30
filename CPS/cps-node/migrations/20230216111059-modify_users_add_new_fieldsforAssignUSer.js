"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("Users", "assignUserID", {
        type: Sequelize.TEXT,
        allowNull: true,
      }),
      queryInterface.addColumn("Users", "assignStartDate", {
        type: Sequelize.DATE,
        allowNull: true,
      }),
      queryInterface.addColumn("Users", "assignEndDate", {
        type: Sequelize.DATE,
        allowNull: true,
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
