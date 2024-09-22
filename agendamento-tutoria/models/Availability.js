import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Availability = sequelize.define('Availability', {
  day: {
    type: DataTypes.STRING, // Armazena o dia da semana (segunda, terça, etc.)
    allowNull: false,
  },
  startTime: {
    type: DataTypes.TIME, // Armazena a hora de início
    allowNull: false,
  },
  endTime: {
    type: DataTypes.TIME, // Armazena a hora de término
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id',
    },
  },
});

export default Availability;
