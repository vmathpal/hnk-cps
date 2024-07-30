"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("AuditLogs", "actionBy", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn("AuditLogs", "comment", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("AuditLogs");
  },
};
