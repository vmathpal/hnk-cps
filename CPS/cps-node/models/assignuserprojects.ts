"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class AssignUserProjects extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AssignUserProjects.init(
    {
      projectID: DataTypes.STRING,
      UserID: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "AssignUserProjects",
    }
  );
  return AssignUserProjects;
};
