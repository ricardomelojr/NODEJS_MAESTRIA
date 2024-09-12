import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('monitoria', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

try {
  await sequelize.authenticate();
  console.log('A conexão foi estabelecida com sucesso.');
} catch (error) {
  console.error('Não foi possível conectar ao banco de dados:', error);
}

export default sequelize;
