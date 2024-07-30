"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class Brand extends Model {
    static associate(models) {}
  }
  Brand.init(
    {
      name: DataTypes.STRING,
      status: DataTypes.STRING,
      brandCode: DataTypes.STRING,
      image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Brand",
    }
  );
  return Brand;
};
