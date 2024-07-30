"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class ProjectBusinessesType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ProjectBusinessesType.belongsTo(models.BusinessType, {
        foreignKey: "businessID",
      });
      // define association here
    }
  }
  ProjectBusinessesType.init(
    {
      projectID: DataTypes.STRING,
      businessID: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "ProjectBusinessesType",
    }
  );
  return ProjectBusinessesType;
};
