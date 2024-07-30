'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("Projects", "created_by", {
        type: Sequelize.INTEGER, // Use Sequelize.DATE instead of Sequelize.Date
        allowNull: true,
         references: {
          model: "Users",
          key: "id",
        },
      }),
    ]);
  },

  async down (queryInterface, Sequelize) {
     return queryInterface.removeColumn(
      'Projects',
      'created_by'
    );
  }
};
