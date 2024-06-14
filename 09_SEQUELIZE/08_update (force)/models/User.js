import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../db/conn.js';

const User = sequelize.define(
  'User',
  {
    // Model attributes are defined here
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    occupation: {
      type: DataTypes.STRING,
      required: true,
      // allowNull defaults to true
    },
    newsletter: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    // Other model options go here
  }
);

export default User;
