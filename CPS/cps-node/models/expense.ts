"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class Expense extends Model {
    static associate(models) {
      // define association here
    }
  }
  Expense.init(
    {
      name: DataTypes.STRING,
      expenseCode: DataTypes.STRING,
      description: DataTypes.TEXT,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Expense",
    }
  );
  return Expense;
};
