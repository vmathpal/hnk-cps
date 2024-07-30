"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class ProjectFile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ProjectFile.belongsTo(models.Project, {
        foreignKey: "projectID",
      });
    }
  }
  ProjectFile.init(
    {
      projectID: DataTypes.STRING,
      file: DataTypes.STRING,
      description: DataTypes.STRING,
      fileType: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "ProjectFile",
    }
  );
  return ProjectFile;
};
