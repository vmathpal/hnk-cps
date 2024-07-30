"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class level3And4Mapping extends Model {
    /** 42:3B:25:EB:3E:CD	Sftddsrggtdd
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      level3And4Mapping.belongsTo(models.role, {
        foreignKey: "roleLevel3",
        as: "first",
      });
      level3And4Mapping.belongsTo(models.role, {
        foreignKey: "roleLevel4",
        as: "second",
      });
      level3And4Mapping.hasMany(models.User, {
        foreignKey: "dept_roleId",
        sourceKey: "roleLevel3",
      });
    }
  }
  level3And4Mapping.init(
    {
      roleLevel3: DataTypes.INTEGER,
      roleLevel4: DataTypes.INTEGER,
      department: DataTypes.STRING,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "level3And4Mapping",
    }
  );
  return level3And4Mapping;
};
