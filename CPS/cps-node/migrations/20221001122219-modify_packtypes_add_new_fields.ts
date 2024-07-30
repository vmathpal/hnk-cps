"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("PackTypes", "lineExtID", {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: "lineExtensions",
          key: "id",
        },
      }),

      queryInterface.addColumn("PackTypes", "sizeID", {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: "SKUs",
          key: "id",
        },
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
