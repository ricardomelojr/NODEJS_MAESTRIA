import { DataTypes } from 'sequelize';
import sequelize from '../db/conn.js';

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  occupation: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  newsletter: {
    type: DataTypes.BOOLEAN,
  },
});

export default User;
