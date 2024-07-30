"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class District extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      District.belongsTo(models.Aria, {
        foreignKey: "areaID",
      });
    }
  }
  District.init(
    {
      name: DataTypes.STRING,
      areaID: DataTypes.NUMBER,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "District",
    }
  );
  return District;
};
