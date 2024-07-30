"use strict";
import { DOUBLE, Model } from "sequelize";

module.exports = (sequelize, DataTypes) => {
  class ProjectBrand extends Model {
    static associate(models) {
      ProjectBrand.belongsTo(models.Project, {
        foreignKey: "projectID",
      });

      ProjectBrand.belongsTo(models.Brand, {
        foreignKey: "brandID",
      });

      ProjectBrand.belongsTo(models.Category, {
        foreignKey: "catID",
      });

      ProjectBrand.belongsTo(models.PackType, {
        foreignKey: "pack_type",
      });
      ProjectBrand.belongsTo(models.SKU, {
        foreignKey: "skuID",
      });
      ProjectBrand.belongsTo(models.lineExtension, {
        foreignKey: "lineExtID",
      });
    }
  }
  ProjectBrand.init(
    {
      projectID: DataTypes.STRING,
      lineExtID: DataTypes.STRING,
      brandID: DataTypes.STRING,
      pack_type: DataTypes.STRING,
      skuID: DataTypes.STRING,
      catID: DataTypes.STRING,
      allocationPercent: DataTypes.STRING,
      allocation: DataTypes.STRING,
      budgetRef: DataTypes.STRING,
      budgetAmount: DataTypes.STRING,
      fy: DataTypes.STRING,
      othContributeBudget: DataTypes.DOUBLE,
      othContributeLastBudget: DataTypes.DOUBLE,
      contributeBudget: DataTypes.DOUBLE,
      contributeLastBudget: DataTypes.DOUBLE,
      volumeWithBudget: DataTypes.DOUBLE,
      volumeWithLastBudget: DataTypes.DOUBLE,
      volumeWithoutBudget: DataTypes.DOUBLE,
      volumeWithoutLastBudget: DataTypes.DOUBLE,
      lastProjectVolumeInc: DataTypes.DOUBLE,
      budgetVolumeIncrease: DataTypes.DOUBLE,
      lastProjectTotalIncrement: DataTypes.DOUBLE,
      budgetProjectTotalIncrement: DataTypes.DOUBLE,
      totalLastOthContribute: DataTypes.DOUBLE,
      totalBudgetOthContribute: DataTypes.DOUBLE,
      actualVolumeWithBudget: DataTypes.STRING,
      varianceVolumeWithBudget: DataTypes.STRING,
      remarkVolumeWithBudget: DataTypes.STRING,
      actualContributeBudget: DataTypes.STRING,
      actualProjectVolumeInc: DataTypes.STRING,
      varianceProjectVolumeInc: DataTypes.STRING,
      remarkProjectVolumeInc: DataTypes.STRING,
      actualProjectTotalIncrement: DataTypes.STRING,
      varianceProjectTotalIncrement: DataTypes.STRING,
      remarkProjectTotalIncrement: DataTypes.STRING,
      othContributeActual: DataTypes.DOUBLE,
      newAllocation: DataTypes.STRING,
      newAllocationPercent: DataTypes.STRING,
      newBudgetAmount: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "ProjectBrand",
    }
  );
  return ProjectBrand;
};
