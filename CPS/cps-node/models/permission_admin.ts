"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class permission_admin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      permission_admin.belongsTo(models.permission, {
        foreignKey: "permissionId",
      });
    }
  }
  permission_admin.init(
    {
      permissionId: DataTypes.NUMBER,
      adminId: DataTypes.NUMBER,
      actions: DataTypes.STRING,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "permission_admin",
    }
  );
  return permission_admin;
};
