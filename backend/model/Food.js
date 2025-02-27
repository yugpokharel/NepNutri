
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database/db'); // Use your database connection

const Food = sequelize.define('Food', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  category: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  calories: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  protein: {
    type: DataTypes.DECIMAL(5, 1),
    allowNull: false
  },
  fat: {
    type: DataTypes.DECIMAL(5, 1),
    allowNull: false
  },
  carbs: {
    type: DataTypes.DECIMAL(5, 1),
    allowNull: false
  }
}, {
  tableName: 'food_items',
  timestamps: false // Disable createdAt/updatedAt if not needed
});

module.exports = Food;