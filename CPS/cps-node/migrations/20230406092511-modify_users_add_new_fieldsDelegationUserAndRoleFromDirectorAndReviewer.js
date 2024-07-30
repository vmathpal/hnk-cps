"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        "DirectorAndReviewerApprovers",
        "delegationUserID",
        {
          allowNull: true,
          type: Sequelize.INTEGER,
          references: {
            model: "Users",
            key: "id",
          },
        }
      ),
      queryInterface.addColumn(
        "DirectorAndReviewerApprovers",
        "delegationRoll",
        {
          type: Sequelize.STRING,
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
