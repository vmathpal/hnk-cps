"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class level5And6Mapping extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      level5And6Mapping.belongsTo(models.role, {
        foreignKey: "roleLevel5",
        as: "first",
      });
      level5And6Mapping.belongsTo(models.role, {
        foreignKey: "roleLevel6",
        as: "second",
      });
      level5And6Mapping.belongsTo(models.level4And5Mapping, {
        foreignKey: "roleLevel5",
        targetKey: "roleLevel5",
      });
      level5And6Mapping.hasMany(models.User, {
        foreignKey: "dept_roleId",
        sourceKey: "roleLevel5",
      });
    }
  }
  level5And6Mapping.init(
    {
      roleLevel5: DataTypes.INTEGER,
      roleLevel6: DataTypes.INTEGER,
      department: DataTypes.STRING,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "level5And6Mapping",
    }
  );
  return level5And6Mapping;
};
