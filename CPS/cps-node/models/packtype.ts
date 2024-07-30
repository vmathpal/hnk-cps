"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class PackType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PackType.belongsTo(models.Brand, {
        foreignKey: "brandID",
      });
      PackType.belongsTo(models.lineExtension, {
        foreignKey: "lineExtID",
      });
      PackType.belongsTo(models.SKU, {
        foreignKey: "sizeID",
      });
    }
  }
  PackType.init(
    {
      name: DataTypes.STRING,
      brandID: DataTypes.NUMBER,
      status: DataTypes.STRING,
      sizeID: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "PackType",
    }
  );
  return PackType;
};
