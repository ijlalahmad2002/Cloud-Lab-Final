const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('datahive_db', 'user', 'password', {
  host: 'postgres-db',
  dialect: 'postgres',
});
module.exports = sequelize;
