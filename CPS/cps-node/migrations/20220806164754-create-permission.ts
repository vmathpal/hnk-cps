'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('permissions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      key: {
        type: Sequelize.STRING
      },
      parentMenuId: {
        type: Sequelize.STRING
      },
      route: {
        type: Sequelize.STRING
      },
      icon: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive', 'deleted'),
        defaultValue: 'active'
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
    await queryInterface.dropTable('permissions');
  }
};