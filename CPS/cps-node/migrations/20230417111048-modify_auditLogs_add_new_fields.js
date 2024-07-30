"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("AuditLogs", "user", {
        allowNull: true,
        type: Sequelize.TEXT,
      }),
      queryInterface.addColumn("AuditLogs", "isAuditLog", {
        allowNull: true,
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn("AuditLogs", "delegatedUser", {
        allowNull: true,
        type: Sequelize.TEXT,
      }),
      queryInterface.addColumn("AuditLogs", "startDate", {
        allowNull: true,
        type: Sequelize.DATE,
      }),
      queryInterface.addColumn("AuditLogs", "endDate", {
        allowNull: true,
        type: Sequelize.DATE,
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
