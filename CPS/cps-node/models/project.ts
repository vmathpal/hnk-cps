"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    static associate(models) {
      Project.hasMany(models.ProjectAreaDistrict, {
        foreignKey: "projectID",
      });
      Project.hasOne(models.DirectorAndReviewerApprover, {
        foreignKey: "projectID",
      });

      Project.hasMany(models.DirectorAndReviewerApprover, {
        foreignKey: "projectID",
        as: "approverComment",
      });
      Project.hasOne(models.ProjectRuntimeStatus, {
        foreignKey: "projectID",
      });
      Project.hasMany(models.ProjectBrand, {
        foreignKey: "projectID",
      });
      Project.hasMany(models.ProjectBusinessesType, {
        foreignKey: "projectID",
      });
      Project.hasMany(models.ProjectExpense, {
        foreignKey: "projectID",
      });
      Project.hasMany(models.ProjectExpense, {
        foreignKey: "projectID",
      });
      Project.hasMany(models.ProjectFile, {
        foreignKey: "projectID",
      });
      Project.belongsTo(models.User, {
        foreignKey: "userID",
      });
      Project.hasOne(models.ProjectTotalProfit, {
        foreignKey: "projectID",
      });
    }
  }
  Project.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      userID: DataTypes.STRING,
      department: DataTypes.STRING,
      projectType: DataTypes.STRING,
      costStartDate: DataTypes.STRING,
      costEndDate: DataTypes.STRING,
      sellingStartDate: DataTypes.STRING,
      sellingEndDate: DataTypes.STRING,
      projectVolume: DataTypes.STRING,
      remark: DataTypes.TEXT,
      rational: DataTypes.TEXT,
      strategy: DataTypes.TEXT,
      forConsumers: DataTypes.TEXT,
      executionPlan: DataTypes.TEXT,
      specificMeasure: DataTypes.TEXT,
      criticalSucess: DataTypes.TEXT,
      launchCriteria: DataTypes.STRING,
      promotionDiscount: DataTypes.STRING,
      status: DataTypes.STRING,
      totalBudget: DataTypes.STRING,
      costEndDay: DataTypes.STRING,
      OldTotalBudget: DataTypes.STRING,
      ChangeStartDate: DataTypes.STRING,
      ChangeEndDate: DataTypes.STRING,
      ChangeStatus: DataTypes.STRING,
      NewCostStartDate: DataTypes.STRING,
      NewCostEndDate: DataTypes.STRING,
      ChangeRequestType: DataTypes.TEXT,
      businessType: DataTypes.STRING,
      runTimeStatus: DataTypes.STRING,
      isProjectNumber: DataTypes.STRING,
      CloserStatus: DataTypes.STRING,
      projectNumber: DataTypes.STRING,
      ref_no: DataTypes.STRING,
      cronStatus: DataTypes.STRING,
      cronUpdateStatus: DataTypes.STRING,
      nextActionBy: DataTypes.STRING,
      crDescription: DataTypes.TEXT,
      final_approved_date: DataTypes.DATE,
      created_by: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Project",
    }
  );
  return Project;
};
