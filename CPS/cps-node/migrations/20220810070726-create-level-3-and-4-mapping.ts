'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('level3And4Mappings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      roleLevel3: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'roles',
          key: 'id'
        },
      },
      roleLevel4: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'roles',
          key: 'id'
        },
      },
      department: {
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
    await queryInterface.dropTable('level3And4Mappings');
  }
};