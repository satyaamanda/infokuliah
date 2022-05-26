'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User_Course extends Model {
    
    static associate(models) {
      // define association here
      
    }
  }
  User_Course.init({
    CourseId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User_Course',
  });
  return User_Course;
};