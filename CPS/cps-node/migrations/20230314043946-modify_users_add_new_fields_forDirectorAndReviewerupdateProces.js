'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("DirectorAndReviewerApprovers", "sequence", {
        type: Sequelize.STRING,
        allowNull: true,
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
