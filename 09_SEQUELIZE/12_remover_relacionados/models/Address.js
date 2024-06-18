import { DataTypes } from 'sequelize';
import sequelize from '../db/conn.js';
import User from './User.js';

const Address = sequelize.define('Address', {
  street: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

User.hasMany(Address, { as: 'Addresses', foreignKey: 'UserId' });
Address.belongsTo(User, { foreignKey: 'UserId' });

export default Address;
