"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      role.belongsTo(models.User, {
        foreignKey: "id",
        targetKey: "dept_roleId",
      });
    }
  }
  role.init(
    {
      role: DataTypes.STRING,
      department: DataTypes.STRING,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "role",
    }
  );
  return role;
};
