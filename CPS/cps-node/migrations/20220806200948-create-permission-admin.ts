'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('permission_admins', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      permissionId: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'permissions',
          key: 'id'
        },
      },
      adminId: { 
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        },
       
      
      },
      actions: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('permission_admins');
  }
};