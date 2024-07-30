"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class CostCenter extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CostCenter.init(
    {
      name: DataTypes.STRING,
      centerCode: DataTypes.STRING,
      department: DataTypes.STRING,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "CostCenter",
    }
  );
  return CostCenter;
};
