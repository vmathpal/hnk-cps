'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
     return Promise.all([
      queryInterface.changeColumn("DirectorAndReviewerApprovers", "sequence", {
        allowNull: true,
        type: Sequelize.INTEGER,
      }),
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
