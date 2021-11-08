'use strict'
require('dotenv').config()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const API_SECRET = process.env.API_SECRET || 'ok'

//schema
const Users = (sequelize, DataTypes)=>{
  const model = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token:{
      type:DataTypes.VIRTUAL,
    }
  
  });

  model.authenticateBasic = async function(username, password)
  {
    const user = await this.findOne({where:{username:username}})
    console.log(user.password)
    console.log(password)
    const valid = await bcrypt.compare(password, user.password)

    if(valid)
    {
      let newToken = jwt.sign({username:user.username},API_SECRET)
      user.token = newToken
      return user
    }
    else
    {
      throw new Error('Invalid user')
    }
  }

  model.authenticateBearer = async function(token)
  {
    const parsedToken = jwt.verify(token, API_SECRET)
    const user = await this.findOne({where:{username:parsedToken.username}})
    if(user.username)
    {
      return user
    }
    else
    {
      throw new Error('Invalid token')
    }
  }
  return model
}
  module.exports = Users