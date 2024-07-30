"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class SKU extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      SKU.belongsTo(models.Brand, {
        foreignKey: "brandID",
      });
      SKU.belongsTo(models.lineExtension, {
        foreignKey: "lineExtID",
      });
    }
  }
  SKU.init(
    {
      name: DataTypes.STRING,
      brandID: DataTypes.NUMBER,
      lineExtID: DataTypes.NUMBER,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "SKU",
    }
  );
  return SKU;
};
