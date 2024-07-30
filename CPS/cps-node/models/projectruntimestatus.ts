"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class ProjectRuntimeStatus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ProjectRuntimeStatus.init(
    {
      projectID: DataTypes.STRING,
      status: DataTypes.STRING,
      role_name: DataTypes.STRING,
      type: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "ProjectRuntimeStatus",
    }
  );
  return ProjectRuntimeStatus;
};
