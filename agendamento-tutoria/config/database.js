import { Sequelize } from 'sequelize';

// Conecte-se ao banco de dados MySQL
export const sequelize = new Sequelize('monitoria', 'root', '', {
  host: 'localhost', // Ou o host do seu banco de dados
  dialect: 'mysql', // O dialect é `mysql`
  logging: false, // Defina como `true` para ver os logs SQL no console
});

// Teste a conexão com o banco de dados
sequelize
  .authenticate()
  .then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso!');
  })
  .catch(error => {
    console.error('Erro ao conectar ao banco de dados:', error);
  });
