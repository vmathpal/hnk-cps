"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class CostCenterUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      CostCenterUser.belongsTo(models.User, {
        foreignKey: "userID",
      });

      CostCenterUser.belongsTo(models.CostCenter, {
        foreignKey: "centerID",
      });
    }
  }
  CostCenterUser.init(
    {
      status: DataTypes.STRING,
      department: DataTypes.STRING,
      centerID: DataTypes.NUMBER,
      userID: DataTypes.NUMBER,
    },
    {
      sequelize,
      modelName: "CostCenterUser",
    }
  );
  return CostCenterUser;
};
