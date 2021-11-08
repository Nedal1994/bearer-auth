'use strict'

require('dotenv').config()
const POSTGRES_URL = process.env.NODE_ENV ? 'Sqlite:memory:' : process.env.DATABASE_URL

const { Sequelize, DataTypes } = require('sequelize')

const Users = require('./users-model')

let sequelizeOptions = process.env.NODE_ENV === 'production' ? {
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        }
    }
} : {};

let sequelize = new Sequelize(POSTGRES_URL,sequelizeOptions)

module.exports = {
    db:sequelize, 
    Users:Users(sequelize,DataTypes)
}