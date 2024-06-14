import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('nodesequelize2', 'root', '', {
  host: 'localhost',
  dialect: 'mysql', // ou outro dialeto que você está usando
});

export default sequelize;
