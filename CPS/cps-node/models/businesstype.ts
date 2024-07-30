"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class BusinessType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  BusinessType.init(
    {
      name: DataTypes.STRING,
      baseChannel: DataTypes.TEXT,
      bizBaseDisc: DataTypes.TEXT,
      code: DataTypes.STRING,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "BusinessType",
    }
  );
  return BusinessType;
};
