"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("ProjectTotalProfits", "actualTotalProfit", {
        allowNull: true,
        type: Sequelize.INTEGER,
        after: "fy",
      }),
      queryInterface.addColumn("ProjectTotalProfits", "varianceTotalProfit", {
        allowNull: true,
        type: Sequelize.INTEGER,
        after: "fy",
      }),
      queryInterface.addColumn("ProjectTotalProfits", "actualRoi", {
        allowNull: true,
        type: Sequelize.INTEGER,
        after: "fy",
      }),
      queryInterface.addColumn("ProjectTotalProfits", "varianceRoi", {
        allowNull: true,
        type: Sequelize.INTEGER,
        after: "fy",
      }),
      queryInterface.addColumn("ProjectTotalProfits", "actualNetContribution", {
        allowNull: true,
        type: Sequelize.INTEGER,
        after: "fy",
      }),
      queryInterface.addColumn(
        "ProjectTotalProfits",
        "varianceNetContribution",
        {
          allowNull: true,
          type: Sequelize.INTEGER,
          after: "fy",
        }
      ),
      queryInterface.addColumn("ProjectTotalProfits", "actualPromotionSpend", {
        allowNull: true,
        type: Sequelize.INTEGER,
        after: "fy",
      }),
      queryInterface.addColumn(
        "ProjectTotalProfits",
        "variancePromotionSpend",
        {
          allowNull: true,
          type: Sequelize.INTEGER,
          after: "fy",
        }
      ),
      queryInterface.addColumn("ProjectTotalProfits", "remarkTotalProfit", {
        allowNull: true,
        type: Sequelize.TEXT,
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
