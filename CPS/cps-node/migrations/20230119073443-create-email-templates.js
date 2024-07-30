"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    // await queryInterface.createTable("email_templates", {
    //   id: {
    //     allowNull: false,
    //     autoIncrement: true,
    //     primaryKey: true,
    //     type: Sequelize.INTEGER,
    //   },
    //   subject: {
    //     type: Sequelize.STRING,
    //   },
    //   variable_name: {
    //     type: Sequelize.STRING,
    //   },
    //   variables: {
    //     type: Sequelize.STRING,
    //   },
    //   description: {
    //     type: Sequelize.TEXT,
    //   },
    //   status: {
    //     type: Sequelize.TEXT,
    //   },
    //   createdAt: {
    //     allowNull: false,
    //     type: Sequelize.DATE,
    //   },
    //   updatedAt: {
    //     allowNull: false,
    //     type: Sequelize.DATE,
    //   },
    // });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("email_templates");
  },
};
