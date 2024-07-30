"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ProjectAreaDistricts", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      channelID: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: "Channels",
          key: "id",
        },
      },
      ariaID: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: "Arias",
          key: "id",
        },
      },
      districtID: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: "Districts",
          key: "id",
        },
      },
      projectID: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: "Projects",
          key: "id",
        },
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
    await queryInterface.dropTable("ProjectAreaDistricts");
  },
};
