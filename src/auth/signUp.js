'use strict'

const bcrypt = require('bcrypt');
const {Users} = require('../models/index')
async function signUp(req, res) {

    try {
      req.body.password = await bcrypt.hash(req.body.password, 10);
      const record = await Users.create(req.body);
      res.status(200).json(record);
    } catch (e) { res.status(403).send(console.error(e)); }
  };

module.exports=signUp