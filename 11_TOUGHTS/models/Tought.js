import { Sequelize, DataTypes } from 'sequelize';
import db from '../db/conn.js';

// User
import User from './User.js';

const Toughts = db.define('Toughts', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Toughts.belongsTo(User);
User.hasMany(Toughts);

export default Toughts;
