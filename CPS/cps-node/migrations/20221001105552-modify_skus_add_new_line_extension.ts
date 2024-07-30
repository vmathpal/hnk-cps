"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("SKUs", "lineExtID", {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: "lineExtensions",
          key: "id",
        },
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
