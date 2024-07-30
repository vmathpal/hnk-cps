"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class DirectorAndReviewerApprover extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      DirectorAndReviewerApprover.belongsTo(models.User, {
        foreignKey: "userID",
      });
      DirectorAndReviewerApprover.belongsTo(models.Project, {
        foreignKey: "projectID",
      });

      DirectorAndReviewerApprover.belongsTo(models.User, {
        foreignKey: "delegationUserID",
        as: "delegation",
      });
    }
  }
  DirectorAndReviewerApprover.init(
    {
      projectID: DataTypes.STRING,
      userID: DataTypes.STRING,
      type: DataTypes.STRING,
      status: DataTypes.STRING,
      comment: DataTypes.STRING,
      isTurn: DataTypes.STRING,
      isMsg: DataTypes.STRING,
      finalEmailStatus: DataTypes.STRING,
      reminderDate: DataTypes.STRING,
      actionDate: DataTypes.STRING,
      sequence: DataTypes.INTEGER,
      role_name: DataTypes.STRING,
      delegationUserID: DataTypes.INTEGER,
      delegationRoll: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "DirectorAndReviewerApprover",
    }
  );
  return DirectorAndReviewerApprover;
};
