"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.changeColumn("ProjectTotalProfits", "currentProjectRoi", {
        type: Sequelize.DOUBLE,
        allowNull: true,
      }),
      queryInterface.changeColumn(
        "ProjectTotalProfits",
        "LastProjectNetContribution",
        {
          type: Sequelize.DOUBLE,
          allowNull: true,
        }
      ),
      queryInterface.changeColumn(
        "ProjectTotalProfits",
        "LastProjectPromotionSpend",
        {
          type: Sequelize.DOUBLE,
          allowNull: true,
        }
      ),
      queryInterface.changeColumn(
        "ProjectTotalProfits",
        "currentProjectNetContribution",
        {
          type: Sequelize.DOUBLE,
          allowNull: true,
        }
      ),
      queryInterface.changeColumn(
        "ProjectTotalProfits",
        "currentProjectPromotionSpend",
        {
          type: Sequelize.DOUBLE,
          allowNull: true,
        }
      ),
      queryInterface.changeColumn(
        "ProjectTotalProfits",
        "currentProjectTotalProfit",
        {
          type: Sequelize.DOUBLE,
          allowNull: true,
        }
      ),
      queryInterface.changeColumn("ProjectTotalProfits", "lastProjectRoi", {
        type: Sequelize.DOUBLE,
        allowNull: true,
      }),
      queryInterface.changeColumn(
        "ProjectTotalProfits",
        "lastProjectTotalProfit",
        {
          type: Sequelize.DOUBLE,
          allowNull: true,
        }
      ),
      queryInterface.changeColumn("ProjectTotalProfits", "actualTotalProfit", {
        type: Sequelize.DOUBLE,
        allowNull: true,
      }),
      queryInterface.changeColumn(
        "ProjectTotalProfits",
        "varianceTotalProfit",
        {
          type: Sequelize.DOUBLE,
          allowNull: true,
        }
      ),
      queryInterface.changeColumn("ProjectTotalProfits", "actualRoi", {
        type: Sequelize.DOUBLE,
        allowNull: true,
      }),
      queryInterface.changeColumn("ProjectTotalProfits", "varianceRoi", {
        type: Sequelize.DOUBLE,
        allowNull: true,
      }),
      queryInterface.changeColumn(
        "ProjectTotalProfits",
        "actualNetContribution",
        {
          type: Sequelize.DOUBLE,
          allowNull: true,
        }
      ),
      queryInterface.changeColumn(
        "ProjectTotalProfits",
        "varianceNetContribution",
        {
          type: Sequelize.DOUBLE,
          allowNull: true,
        }
      ),
      queryInterface.changeColumn(
        "ProjectTotalProfits",
        "actualPromotionSpend",
        {
          type: Sequelize.DOUBLE,
          allowNull: true,
        }
      ),
      queryInterface.changeColumn(
        "ProjectTotalProfits",
        "variancePromotionSpend",
        {
          type: Sequelize.DOUBLE,
          allowNull: true,
        }
      ),
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
