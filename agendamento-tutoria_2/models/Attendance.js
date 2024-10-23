import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Availability from './Availability.js';
import User from './User.js';

const Attendance = sequelize.define('Attendance', {
  idAttendance: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  status: {
    type: DataTypes.ENUM('Presente', 'Ausente'), // Status de presença ou ausência
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY, // Armazena apenas a data (sem a hora)
    allowNull: false,
  },
  idAvailability: {
    type: DataTypes.INTEGER,
    references: {
      model: Availability, // Relaciona com o model Availability
      key: 'id',
    },
    allowNull: false,
    onDelete: 'CASCADE',
  },
  idUser: {
    type: DataTypes.INTEGER,
    references: {
      model: User, // Relaciona com o model User
      key: 'idUser',
    },
    allowNull: false,
    onDelete: 'CASCADE',
  },
});

// Definindo associações
User.hasMany(Attendance, { foreignKey: 'idUser' });
Attendance.belongsTo(User, { foreignKey: 'idUser' });

Availability.hasMany(Attendance, { foreignKey: 'idAvailability' });
Attendance.belongsTo(Availability, { foreignKey: 'idAvailability' });

export default Attendance;
