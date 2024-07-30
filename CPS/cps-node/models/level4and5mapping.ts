"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class level4And5Mapping extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      level4And5Mapping.belongsTo(models.role, {
        foreignKey: "roleLevel4",
        as: "first",
      });
      level4And5Mapping.belongsTo(models.role, {
        foreignKey: "roleLevel5",
        as: "second",
      });
      level4And5Mapping.belongsTo(models.level3And4Mapping, {
        foreignKey: "roleLevel4",
        targetKey: "roleLevel4",
      });
      level4And5Mapping.hasMany(models.User, {
        foreignKey: "dept_roleId",
        sourceKey: "roleLevel4",
      });
    }
  }
  level4And5Mapping.init(
    {
      roleLevel4: DataTypes.INTEGER,
      roleLevel5: DataTypes.INTEGER,
      department: DataTypes.STRING,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "level4And5Mapping",
    }
  );
  return level4And5Mapping;
};
