import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js'; // Verifique se o arquivo `database.js` contém a configuração do Sequelize

const User = sequelize.define(
  'User',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false, // O campo nome não pode ser nulo
      validate: {
        notEmpty: { msg: 'O nome não pode estar vazio.' },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // O email deve ser único
      validate: {
        isEmail: { msg: 'Digite um endereço de email válido.' },
        notEmpty: { msg: 'O email não pode estar vazio.' },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false, // O campo senha não pode ser nulo
      validate: {
        len: {
          args: [6, 100],
          msg: 'A senha deve ter no mínimo 6 caracteres.',
        },
      },
    },
    role: {
      type: DataTypes.ENUM('Administrador', 'Aluno', 'Monitor'),
      allowNull: false,
      defaultValue: 'Aluno', // Define "Aluno" como o papel padrão
    },
  },
  {
    tableName: 'users', // Nome da tabela no banco de dados
    timestamps: true, // Cria campos `createdAt` e `updatedAt`
  }
);

export default User;
