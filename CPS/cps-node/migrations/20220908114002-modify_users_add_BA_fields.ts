"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("Users", "baID", {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: "BusinessAnalysts",
          key: "id",
        },
        after: "status",
      }),
      queryInterface.addColumn("Users", "isBA", {
        allowNull: true,
        type: Sequelize.ENUM("true", "false"),
        defaultValue: "false",
        after: "baID",
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("Users", "isID"),
      queryInterface.removeColumn("Users", "isBA"),
    ]);
  },
};
