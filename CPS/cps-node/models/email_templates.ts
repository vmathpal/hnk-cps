'use strict';
import {
  Model
} from 'sequelize';
module.exports = (sequelize, DataTypes) => {
  class email_templates extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  email_templates.init({
    subject: DataTypes.TEXT,
    variable_name:DataTypes.TEXT,
    description:DataTypes.TEXT,
    variables:DataTypes.TEXT,
    status:DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'email_templates',
  });
  return email_templates;
};