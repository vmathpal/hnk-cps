"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class permission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  permission.init(
    {
      name: DataTypes.STRING,
      key: DataTypes.STRING,
      parentMenuId: DataTypes.STRING,
      route: DataTypes.STRING,
      icon: DataTypes.STRING,
      status: DataTypes.STRING,
      sequence: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "permission",
    }
  );
  return permission;
};
