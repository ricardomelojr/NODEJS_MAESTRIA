import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('nodesequelize2', 'root', '', {
  host: 'localhost',
  dialect: 'mysql', // ou outro dialeto que você está usando
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

export default sequelize;
