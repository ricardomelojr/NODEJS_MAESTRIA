import { Sequelize, DataTypes } from 'sequelize';
import db from '../db/conn.js';

const User = db.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM,
    values: ['Administrador', 'Aluno', 'Monitor'],
    defaultValue: 'Aluno',
  },
});

export default User;
