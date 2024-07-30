"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class ProjectReviewers extends Model {
    static associate(models) {
      ProjectReviewers.belongsTo(models.User, {
        foreignKey: "userID",
      });
    }
  }
  ProjectReviewers.init(
    {
      projectID: DataTypes.STRING,
      userID: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "ProjectReviewers",
    }
  );
  return ProjectReviewers;
};
