module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.TEXT
      },
      department: {
        type: Sequelize.STRING
      },
      level: {
        type: Sequelize.STRING
      },
      mobile: {
        type: Sequelize.STRING
      },
      role: {
        type: Sequelize.ENUM('super_admin', 'sub_admin', 'user'),
        defaultValue: 'user'
       },
      dept_roleId: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'roles',
          key: 'id'
        },
      },
      isGM:{
        type: Sequelize.ENUM("yes", "no"),
        defaultValue: "no",
      },
      status: {
        type: Sequelize.ENUM("deactive", "active","deleted"),
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
    await queryInterface.dropTable('Users');
  }
};