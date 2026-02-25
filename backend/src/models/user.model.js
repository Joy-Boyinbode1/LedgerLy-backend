import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const User = sequelize.define('User',
  {
    // Model attributes 
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8, 255]  // minimum 8 characters before hashing
      }
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: true
    },
    otpExpires: {
      type: DataTypes.DATE,
      allowNull: true
    },
    otpAttempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
    ,
    emailVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }


  },

  {
    tableName: 'users',
    timestamps: true
  }
);

// `sequelize.define` also returns the model
//console.log(User === sequelize.models.User); // true

export default User;