const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/db');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            is: /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/i,
            notEmpty: true
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [8, 100]
        }
    },
    goals: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false
    },
    barriers: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false
    },
    heightFeet: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        validate: {
            min: 1,
            max: 8
        }
    },
    heightInches: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        validate: {
            min: 0,
            max: 11
        }
    },
    currentWeight: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        validate: {
            min: 20,
            max: 500
        }
    },
    goalWeight: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        // validate: {
        //     isLessThanCurrentWeight(value) {
        //         if (value >= this.currentWeight) {
        //             throw new Error('Goal weight must be less than current weight for weight loss');
        //         }
        //     }
        // }
    },
    country: {
        type: DataTypes.STRING,
        allowNull: false
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 13,
          max: 120
        }
      },
    gender: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [["Male", "Female", "Other"]]
        }
    }
}, {
    tableName: 'users',
    timestamps: true
});

// Password hashing hooks
User.beforeCreate(async (user) => {
    if (user.password) {
        user.password = bcrypt.hashSync(user.password, 12);
    }
});

User.beforeUpdate(async (user) => {
    if (user.changed('password')) {
        user.password = bcrypt.hashSync(user.password, 12);
    }
});

module.exports = User;