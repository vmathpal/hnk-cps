"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class Aria extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Aria.belongsTo(models.Channel, {
        foreignKey: "channelID",
      });
    }
  }
  Aria.init(
    {
      name: DataTypes.STRING,
      channelID: DataTypes.NUMBER,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Aria",
      tableName: "Arias",
    }
  );
  return Aria;
};
