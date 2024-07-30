"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("CostCenterUsers", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      centerID: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: "CostCenters",
          key: "id",
        },
      },
      userID: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
      },
      status: {
        type: Sequelize.ENUM("active", "inactive"),
        defaultValue: "active",
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
    await queryInterface.dropTable("CostCenterUsers");
  },
};
