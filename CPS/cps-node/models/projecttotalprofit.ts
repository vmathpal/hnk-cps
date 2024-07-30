"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class ProjectTotalProfit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ProjectTotalProfit.init(
    {
      projectID: DataTypes.INTEGER,
      LastProjectNetContribution: DataTypes.DOUBLE,
      LastProjectPromotionSpend: DataTypes.DOUBLE,
      currentProjectNetContribution: DataTypes.DOUBLE,
      currentProjectPromotionSpend: DataTypes.DOUBLE,
      currentProjectRoi: DataTypes.DOUBLE,
      currentProjectTotalProfit: DataTypes.DOUBLE,
      lastProjectRoi: DataTypes.DOUBLE,
      lastProjectTotalProfit: DataTypes.DOUBLE,
      actualTotalProfit: DataTypes.DOUBLE,
      varianceTotalProfit: DataTypes.DOUBLE,
      actualRoi: DataTypes.DOUBLE,
      varianceRoi: DataTypes.DOUBLE,
      actualNetContribution: DataTypes.DOUBLE,
      varianceNetContribution: DataTypes.DOUBLE,
      actualPromotionSpend: DataTypes.DOUBLE,
      variancePromotionSpend: DataTypes.DOUBLE,
      remarkTotalProfit: DataTypes.TEXT,
      showCalculation: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "ProjectTotalProfit",
    }
  );
  return ProjectTotalProfit;
};
