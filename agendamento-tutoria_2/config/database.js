import { Sequelize } from 'sequelize';

// Conecte-se ao banco de dados MySQL
const sequelize = new Sequelize('monitoria', 'root', 'root123', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false, // Desativa o log de queries no console
});

// Testar a conexão
sequelize
  .authenticate()
  .then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso!');
  })
  .catch((error) => {
    console.error('Erro ao conectar ao banco de dados:', error);
  });

export default sequelize; // Exportando como exportação padrão
