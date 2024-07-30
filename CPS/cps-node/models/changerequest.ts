"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class ChangeRequest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ChangeRequest.init(
    {
      projectBrandID: DataTypes.STRING,
      projectID: DataTypes.STRING,
      allocationPercent: DataTypes.STRING,
      allocation: DataTypes.STRING,
      budgetRef: DataTypes.STRING,
      budgetAmount: DataTypes.STRING,
      fy: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "ChangeRequest",
    }
  );
  return ChangeRequest;
};
