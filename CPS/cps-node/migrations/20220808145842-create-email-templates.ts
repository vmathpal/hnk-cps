'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('email_templates', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      subject: {
        type: Sequelize.TEXT
      },
      variable_name: {
        type: Sequelize.TEXT
      },
      description: {
        type: Sequelize.TEXT
      },
      variables: {
        type: Sequelize.TEXT
      },
      status: {
        type: Sequelize.ENUM("inactive", "active","deleted"),
        defaultValue: "active",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('email_templates');
  }
};