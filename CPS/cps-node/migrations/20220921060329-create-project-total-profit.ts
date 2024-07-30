"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ProjectTotalProfits", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      projectID: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: "Projects",
          key: "id",
        },
      },
      LastProjectNetContribution: {
        type: Sequelize.INTEGER,
      },
      lastProjectTotalProfit: {
        type: Sequelize.INTEGER,
      },
      lastProjectRoi: {
        type: Sequelize.INTEGER,
      },
      LastProjectPromotionSpend: {
        type: Sequelize.INTEGER,
      },
      currentProjectNetContribution: {
        type: Sequelize.INTEGER,
      },
      currentProjectRoi: {
        type: Sequelize.INTEGER,
      },
      currentProjectPromotionSpend: {
        type: Sequelize.INTEGER,
      },
      currentProjectTotalProfit: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("ProjectTotalProfits");
  },
};
