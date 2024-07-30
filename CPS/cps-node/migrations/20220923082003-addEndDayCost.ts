"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("Projects", "costEndDay", {
        allowNull: true,
        type: Sequelize.STRING,
        after: "status",
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([queryInterface.removeColumn("Projects", "costEndDay")]);
  },
};
