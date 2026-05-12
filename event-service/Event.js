const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const Event = sequelize.define('Event', {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  creatorId: { type: DataTypes.INTEGER, allowNull: false }
});

module.exports = Event;
