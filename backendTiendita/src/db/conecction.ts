const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('u700514341_prebussines', 'u700514341_bussines', 'i1&qQfA5K', {
  host: 'srv1294.hstgr.io',
  dialect: 'mysql'
});
sequelize.authenticate();

export default sequelize;


