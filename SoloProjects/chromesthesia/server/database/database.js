const Sequelize = require('sequelize');

var sequelize = new Sequelize(process.env.DBNAME, process.env.DBUSER, process.env.DBPASSWORD, {
    host: 'chromesthesiadbinstance.cw0xkvj02vii.us-east-1.rds.amazonaws.com',
    port: 5432,
    logging: console.log,
    maxConcurrentQueries: 100,
    dialect: 'postgres',
    dialectOptions: {
        ssl:'Amazon RDS'
    },
    pool: { maxConnections: 5, maxIdleTime: 30},
    language: 'en'
})

const Track = sequelize.define(
  "track",
  {
    red: {
      type: Sequelize.FLOAT,
      allowNull: false
    },
    green: {
      type: Sequelize.FLOAT,
      allowNull: false
    },
    blue: {
      type: Sequelize.FLOAT,
      allowNull: false
    },
    trackUri: {
      type: Sequelize.STRING
    },
    track: {
      type: Sequelize.STRING
    },
    artist: {
      type: Sequelize.STRING
    },
    album: {
      type: Sequelize.STRING
    },
    spotifyId: {
      type: Sequelize.STRING
    }
  }
);

module.exports = Track;
