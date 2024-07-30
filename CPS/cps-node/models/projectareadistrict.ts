"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class ProjectAreaDistrict extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ProjectAreaDistrict.belongsTo(models.Channel, {
        foreignKey: "channelID",
      });

      ProjectAreaDistrict.belongsTo(models.Aria, {
        foreignKey: "ariaID",
      });

      ProjectAreaDistrict.belongsTo(models.District, {
        foreignKey: "districtID",
      });

      ProjectAreaDistrict.belongsTo(models.Project, {
        foreignKey: "projectID",
      });
    }
  }
  ProjectAreaDistrict.init(
    {
      ariaID: DataTypes.STRING,
      districtID: DataTypes.STRING,
      channelID: DataTypes.STRING,
      projectID: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "ProjectAreaDistrict",
    }
  );
  return ProjectAreaDistrict;
};
