"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class ProjectType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ProjectType.init(
    {
      name: DataTypes.STRING,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "ProjectType",
    }
  );
  return ProjectType;
};
