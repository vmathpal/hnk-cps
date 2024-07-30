"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("Users", "channelID", {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: "Channels",
          key: "id",
        },
        after: "status",
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([queryInterface.removeColumn("Users", "channelID")]);
  },
};
