"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class discussion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      discussion.belongsTo(models.Project, {
        foreignKey: "ProjectID",
      });
      discussion.belongsTo(models.User, {
        foreignKey: "senderID",
      });
    }
  }
  discussion.init(
    {
      ProjectID: DataTypes.STRING,
      senderID: DataTypes.STRING,
      message: DataTypes.STRING,
      status: DataTypes.STRING,
      isEdited: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "discussion",
    }
  );
  return discussion;
};
