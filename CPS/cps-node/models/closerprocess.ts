"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class CloserProcess extends Model {
    static associate(models) {
      CloserProcess.belongsTo(models.Project, {
        foreignKey: "projectID",
      });
      CloserProcess.belongsTo(models.User, {
        foreignKey: "userID",
      });
    }
  }
  CloserProcess.init(
    {
      userID: DataTypes.INTEGER,
      projectID: DataTypes.INTEGER,
      scopeofevaluation: DataTypes.TEXT,
      explanation: DataTypes.TEXT,
      whatweworked: DataTypes.TEXT,
      whatwedidnotwork: DataTypes.TEXT,
      objective: DataTypes.TEXT,
      eventhighlights: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "CloserProcess",
    }
  );
  return CloserProcess;
};
