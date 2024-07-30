"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ProjectBrands", {
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
      brandID: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: "Brands",
          key: "id",
        },
      },
      pack_type: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: "PackTypes",
          key: "id",
        },
      },
      skuID: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: "SKUs",
          key: "id",
        },
      },
      catID: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: "Categories",
          key: "id",
        },
      },
      allocationPercent: {
        type: Sequelize.DOUBLE,
      },
      allocation: {
        type: Sequelize.DOUBLE,
      },
      budgetRef: {
        type: Sequelize.STRING,
      },
      budgetAmount: {
        type: Sequelize.DOUBLE,
      },
      fy: {
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
    await queryInterface.dropTable("ProjectBrands");
  },
};
