const { Sequelize, DATE, DataTypes } = require("sequelize");
const db = require("../../config/db");

const users = db.define(
  "users",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: "Username is required",
      },
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: "Body is required",
      },
    },
  },
  {
    timestamps: false,
  }
);

module.exports = users;
