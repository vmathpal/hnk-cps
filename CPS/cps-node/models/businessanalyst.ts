"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class BusinessAnalyst extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      BusinessAnalyst.hasMany(models.User, {
        foreignKey: "baID",
      });
    }
  }
  // foreignKey: "dept_roleId",
  // sourceKey: "roleLevel3",
  BusinessAnalyst.init(
    {
      name: DataTypes.STRING,
      department: DataTypes.STRING,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "BusinessAnalyst",
    }
  );
  return BusinessAnalyst;
};
