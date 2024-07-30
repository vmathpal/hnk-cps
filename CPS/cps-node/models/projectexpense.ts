"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class ProjectExpense extends Model {
    static associate(models) {
      ProjectExpense.hasMany(models.CostCenterUser, {
        foreignKey: "centerID",
        sourceKey: "costCenterID",
      });

      ProjectExpense.belongsTo(models.Project, {
        foreignKey: "projectID",
      });

      ProjectExpense.belongsTo(models.Brand, {
        foreignKey: "brandID",
      });

      ProjectExpense.belongsTo(models.CostCenter, {
        foreignKey: "costCenterID",
      });
      ProjectExpense.belongsTo(models.Expense, {
        foreignKey: "expenseID",
      });

      ProjectExpense.belongsTo(models.lineExtension, {
        foreignKey: "lineExtID",
      });
    }
  }

  ProjectExpense.init(
    {
      projectID: DataTypes.STRING,
      brandID: DataTypes.NUMBER,
      lineExtID: DataTypes.NUMBER,
      expenseID: DataTypes.NUMBER,
      costCenterID: DataTypes.STRING,
      expenses: DataTypes.STRING,
      scoa: DataTypes.STRING,
      lastProject: DataTypes.STRING,
      budget: DataTypes.STRING,
      newBudgetExpenses: DataTypes.DOUBLE,
      actualExpenseBudget: DataTypes.STRING,
      varianceBudget: DataTypes.STRING,
      expenseRemark: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "ProjectExpense",
    }
  );
  return ProjectExpense;
};
