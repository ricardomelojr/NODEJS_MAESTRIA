import { Sequelize, DataTypes } from 'sequelize';
import db from '../db/conn.js';

const User = db.define(
  'Product',
  {
    // Model attributes are defined here
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      // allowNull defaults to true
    },
  },
  {
    // Other model options go here
  }
);
