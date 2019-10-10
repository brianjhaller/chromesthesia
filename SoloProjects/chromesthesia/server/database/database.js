const Sequelize = require('sequelize');

const sequelize = 
  new Sequelize("postgres://nmayakie:tFUGLb9nLpQRgri4NSwrodIuGMiTxwcR@salt.db.elephantsql.com:5432/nmayakie");

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
