"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AuditLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      AuditLog.belongsTo(models.User, {
        foreignKey: "userID",
      });
      AuditLog.belongsTo(models.Project, {
        foreignKey: "projectID",
      });
    }
  }
  AuditLog.init(
    {
      userID: DataTypes.STRING,
      projectID: DataTypes.STRING,
      action: DataTypes.STRING,
      newValue: DataTypes.JSONB,
      oldValue: DataTypes.JSONB,
      modal: DataTypes.STRING,
      userName: DataTypes.STRING,
      projectName: DataTypes.STRING,
      message: DataTypes.STRING,
      actionBy: DataTypes.STRING,
      comment: DataTypes.STRING,
      user: DataTypes.TEXT,
      isAuditLog: DataTypes.STRING,
      delegatedUser: DataTypes.TEXT,
      startDate: DataTypes.STRING,
      endDate: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "AuditLog",
    }
  );
  return AuditLog;
};
