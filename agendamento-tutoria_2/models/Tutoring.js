import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Student from './User.js'; // Assumindo que o model de Student é parte do User e tem role de 'Aluno'
import Availability from './Availability.js'; // O modelo de Availability já existente

// Definindo o modelo Tutoring
const Tutoring = sequelize.define(
  'Tutoring',
  {
    idUser: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Student, // Relaciona com o model Student (que seria a tabela Users)
        key: 'idUser', // Assumindo que o campo chave do aluno é idUser
      },
      onDelete: 'CASCADE', // Deletar agendamentos se o aluno for removido
      allowNull: false,
    },
    idAvailability: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Availability, // Relaciona com o model Availability
        key: 'id', // Assumindo que o campo chave de Availability é 'id'
      },
      onDelete: 'CASCADE', // Deletar agendamentos se a disponibilidade for removida
      allowNull: false,
    },
  },
  {
    timestamps: false, // Se você não precisa de campos createdAt e updatedAt
    tableName: 'Tutoring', // Nome da tabela
  },
);

// Definir as associações
Student.hasMany(Tutoring, { foreignKey: 'idUser' });
Tutoring.belongsTo(Student, { foreignKey: 'idUser' });

Availability.hasMany(Tutoring, { foreignKey: 'idAvailability' });
Tutoring.belongsTo(Availability, { foreignKey: 'idAvailability' });

export default Tutoring;
