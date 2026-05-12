const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('datahive_db', 'user', 'password', {
  host: 'postgres-db', // This matches the service name in your docker-compose.yml
  dialect: 'postgres',
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL Connected...');
  } catch (err) {
    console.error('Unable to connect to the database:', err);
  }
};

module.exports = { sequelize, connectDB };
