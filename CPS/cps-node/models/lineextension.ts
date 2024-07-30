"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class lineExtension extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      lineExtension.belongsTo(models.Brand, {
        foreignKey: "brandID",
      });
    }
  }
  lineExtension.init(
    {
      lineExtCode: DataTypes.STRING,
      name: DataTypes.STRING,
      status: DataTypes.STRING,
      brandID: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "lineExtension",
      tableName: "lineExtensions",
    }
  );
  return lineExtension;
};
