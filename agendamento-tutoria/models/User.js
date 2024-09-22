import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import Availability from './Availability.js'; // Importa o modelo Availability

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('Administrador', 'Aluno', 'Monitor'),
    allowNull: false,
    defaultValue: 'Aluno',
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: true, // Apenas monitores terão disciplinas
  },
});

// Defina a associação hasMany entre User e Availability
User.hasMany(Availability, {
  foreignKey: 'userId',
  as: 'availabilities',
});

export default User;
