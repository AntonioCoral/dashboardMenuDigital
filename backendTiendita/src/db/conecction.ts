const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('u700514341_pruebasTienda', 'u700514341_userPrueba', 'QXHwGzM5d2pc#TV', {
  host: 'srv1294.hstgr.io',
  dialect: 'mysql'
});
sequelize.authenticate();

export default sequelize;


