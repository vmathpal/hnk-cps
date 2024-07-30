'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TagRoles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      levelId: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'Levels',
          key: 'id'
        },
      },
      roleId: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'roles',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
    await queryInterface.dropTable('TagRoles');
  }
};