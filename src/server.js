'use strict';

// 3rd Party Resources
const express = require('express');
const bcrypt = require('bcrypt');
const base64 = require('base-64');
const { Sequelize, DataTypes } = require('sequelize');
const Users = require('./models/users-model')
const bearer = require('./middleware/bearer')
const basic = require('./middleware/basic')


const errorHandler = require('./error-handlers/500.js');
const notFound = require('./error-handlers/404.js');

const signIn = require('./auth/signIn')
const signUp = require('./auth/signUp')

const server = express();


server.use(express.json());

const sequelize = new Sequelize(process.env.DATABASE_URL);

server.use(express.urlencoded({ extended: true }));


server.post('/signup', signUp)
server.post('/signin', basic, async (req, res) => {
  res.status(200).json(req.user);
})

server.get('/user', bearer, (req, res) => {
  res.send('you are authorized to view the user profile')
})

server.use(notFound)
server.use(errorHandler)

sequelize.sync()
  .then(() => {
    server.listen(3000, () => console.log('server up'));
  }).catch(e => {
    console.error('Could not start server', e.message);
  });

function start(PORT) {
  server.listen(PORT, () => {
    console.log(`${PORT}`)
  })
}

module.exports = { server: server, start: start }