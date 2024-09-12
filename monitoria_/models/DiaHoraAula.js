import { Sequelize, DataTypes } from 'sequelize';
import db from '../db/conn.js';
import User from './User.js'; // Relacionamento com o modelo User

const DiaHoraAula = db.define(
  'DiaHoraAula',
  {
    diaSemana: {
      type: DataTypes.ENUM(
        'Segunda',
        'Terça',
        'Quarta',
        'Quinta',
        'Sexta',
        'Sábado',
        'Domingo'
      ),
      allowNull: false,
    },
    horaInicio: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    horaFim: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users', // Nome da tabela do modelo User no banco de dados
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  },
  {
    timestamps: false,
  }
);

// Definindo o relacionamento
User.hasMany(DiaHoraAula, { foreignKey: 'userId' });
DiaHoraAula.belongsTo(User, { foreignKey: 'userId' });

export default DiaHoraAula;
