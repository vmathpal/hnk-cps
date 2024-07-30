"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("AuditLogs", "userName", {
        allowNull: true,
        type: Sequelize.STRING,
        after: "userID",
      }),
      queryInterface.addColumn("AuditLogs", "projectName", {
        allowNull: true,
        type: Sequelize.STRING,
        after: "userID",
      }),
      queryInterface.addColumn("AuditLogs", "message", {
        allowNull: true,
        type: Sequelize.TEXT,
        after: "userID",
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
