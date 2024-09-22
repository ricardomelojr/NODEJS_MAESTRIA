import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; // Importar o Sequelize como exportação padrão

const User = sequelize.define(
  'User',
  {
    idUser: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
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
      type: DataTypes.ENUM('Administrador', 'Estudante', 'Monitor'),
      allowNull: false,
      defaultValue: 'Estudante',
    },
  },
  {
    tableName: 'users',
    timestamps: true,
  }
);

export default User;
