'use strict';
import {
  Model
} from 'sequelize';
module.exports = (sequelize, DataTypes) => {
  class token extends Model {
    
    static associate(models) {
      // define association here
    }
  }
  token.init({
    userId: DataTypes.NUMBER,
    token: DataTypes.TEXT,
    status:DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'token',
  });
  return token;
};