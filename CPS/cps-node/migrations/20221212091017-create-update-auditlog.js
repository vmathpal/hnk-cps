"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("AuditLogs", "modal", {
        allowNull: true,
        type: Sequelize.STRING,
        after: "action",
      }),
    ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("updateAuditlogs");
  },
};
