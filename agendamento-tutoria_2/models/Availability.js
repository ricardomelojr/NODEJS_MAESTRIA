import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js'; // Importando o modelo de User para definir a relação

// Definindo o modelo Availability
const Availability = sequelize.define('Availability', {
  subject: {
    type: DataTypes.STRING,
    allowNull: false, // O assunto não pode ser nulo
  },
  day: {
    type: DataTypes.STRING,
    allowNull: false, // O dia não pode ser nulo
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: false, // O horário de início não pode ser nulo
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: false, // O horário de fim não pode ser nulo
  },
  status: {
    type: DataTypes.ENUM('Iniciado', 'Finalizado'),
    allowNull: false,
    defaultValue: 'Iniciado',
  },
  idUser: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users', // Nome da tabela User (assumindo que a tabela de usuários seja 'Users')
      key: 'idUser', // Chave estrangeira é o id do usuário
    },
    onDelete: 'CASCADE', // Se o usuário for deletado, suas disponibilidades também são
  },
});

// Definir a relação: 1 usuário possui 0 ou mais disponibilidades
User.hasMany(Availability, { foreignKey: 'idUser', onDelete: 'CASCADE' });
Availability.belongsTo(User, { foreignKey: 'idUser' });

export default Availability;
