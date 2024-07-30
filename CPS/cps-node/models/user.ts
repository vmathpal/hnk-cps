"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsTo(models.role, {
        foreignKey: "dept_roleId",
        as: "roleName",
      });
      User.belongsTo(models.BusinessAnalyst, {
        foreignKey: "baID",
      });
      User.belongsTo(models.User, {
        foreignKey: "delegationUserID",
        as: "delegation",
      });
      User.belongsTo(models.Channel, {
        foreignKey: "channelID",
      });
      User.belongsTo(models.CostCenter, {
        foreignKey: "id",
      });
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      ccEmail: DataTypes.STRING,
      password: DataTypes.STRING,
      status: DataTypes.STRING,
      role: DataTypes.STRING,
      department: DataTypes.STRING,
      dept_roleId: DataTypes.NUMBER,
      level: DataTypes.STRING,
      mobile: DataTypes.STRING,
      isGM: DataTypes.STRING,
      isBA: DataTypes.STRING,
      baID: DataTypes.NUMBER,
      channelID: DataTypes.NUMBER,
      assignUserID: DataTypes.NUMBER,
      assignStartDate: DataTypes.NUMBER,
      assignEndDate: DataTypes.NUMBER,
      delegationUserID: DataTypes.NUMBER,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
