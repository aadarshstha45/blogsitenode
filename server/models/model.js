const {Sequelize, DATE, DataTypes} = require('sequelize');
const db = require('../../config/db');

const save = db.define('blogsite', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notNull: 'Title is required'
        }
    },
     body: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notNull: 'Body is required'
        }
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false
})

module.exports = save;