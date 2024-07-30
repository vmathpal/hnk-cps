"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("ProjectBrands", "othContributeActual", {
        allowNull: true,
        type: Sequelize.DOUBLE,
        after: "fy",
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
