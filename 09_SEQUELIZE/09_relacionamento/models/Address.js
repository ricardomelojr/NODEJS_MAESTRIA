import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../db/conn.js';
import User from './User.js';

const Address = sequelize.define('Address', {
  street: {
    type: DataTypes.STRING,
    required: true,
  },
  number: {
    type: DataTypes.STRING,
    required: true,
  },
  city: {
    type: DataTypes.STRING,
    required: true,
  },
});

Address.belongsTo(User);

export default Address;
