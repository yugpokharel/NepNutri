const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/db');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    firstname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: { isEmail: true },
    },
    username: {
        type: DataTypes.STRING,
        allowNull: true, 
        validate: { len: [3, 50] },
    },
    password_hash: {
        type: DataTypes.STRING,
        allowNull: true, 
        validate: { len: [8, 100] },
    },
    goal: {
        type: DataTypes.ARRAY(DataTypes.STRING),  // Updated to store an array of strings
        allowNull: true,
    },
    height: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
    },
    weight: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    gender: {
        type: DataTypes.STRING(10),
        allowNull: true,
    },
    goalweight: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
    },
}, {
    tableName: 'users',
    freezeTableName: true,
    timestamps: false,
});

module.exports = User;
