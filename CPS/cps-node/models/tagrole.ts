'use strict';
import {
  Model
} from 'sequelize';
module.exports = (sequelize, DataTypes) => {
  class TagRole extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      TagRole.belongsTo(models.Level,{foreignKey:"levelId"});
      TagRole.belongsTo(models.role,{foreignKey:"roleId"});
    }
  }
  TagRole.init({
    levelId: DataTypes.INTEGER,
    roleId: DataTypes.INTEGER,
    status:DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'TagRole',
  });
  return TagRole;
};