"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("ProjectBrands", "actualVolumeWithBudget", {
        allowNull: true,
        type: Sequelize.STRING,
        after: "fy",
      }),
      queryInterface.addColumn("ProjectBrands", "varianceVolumeWithBudget", {
        allowNull: true,
        type: Sequelize.STRING,
        after: "fy",
      }),
      queryInterface.addColumn("ProjectBrands", "remarkVolumeWithBudget", {
        allowNull: true,
        type: Sequelize.STRING,
        after: "fy",
      }),
      queryInterface.addColumn("ProjectBrands", "actualContributeBudget", {
        allowNull: true,
        type: Sequelize.STRING,
        after: "fy",
      }),
      queryInterface.addColumn("ProjectBrands", "actualProjectVolumeInc", {
        allowNull: true,
        type: Sequelize.STRING,
        after: "fy",
      }),
      queryInterface.addColumn("ProjectBrands", "varianceProjectVolumeInc", {
        allowNull: true,
        type: Sequelize.STRING,
        after: "fy",
      }),
      queryInterface.addColumn("ProjectBrands", "remarkProjectVolumeInc", {
        allowNull: true,
        type: Sequelize.STRING,
        after: "fy",
      }),
      queryInterface.addColumn("ProjectBrands", "actualProjectTotalIncrement", {
        allowNull: true,
        type: Sequelize.STRING,
        after: "fy",
      }),
      queryInterface.addColumn(
        "ProjectBrands",
        "varianceProjectTotalIncrement",
        {
          allowNull: true,
          type: Sequelize.STRING,
          after: "fy",
        }
      ),
      queryInterface.addColumn("ProjectBrands", "remarkProjectTotalIncrement", {
        allowNull: true,
        type: Sequelize.STRING,
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
