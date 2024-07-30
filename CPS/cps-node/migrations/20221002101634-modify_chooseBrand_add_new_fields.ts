"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("ProjectBrands", "lineExtID", {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: "lineExtensions",
          key: "id",
        },
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
