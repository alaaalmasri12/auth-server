'use strict';
const mongoose = require('mongoose');
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET; // place this in your .env
const usersschema = require('./user-schema');
const Module = require('./model');
const modulesq = new Module(usersschema);
console.log(modulesq);
let db = {};
let users = {};
users.save = async function (record) {
  console.log('ented');
  let userdata = await modulesq.read(record.username);
  if (!userdata.length) {
    console.log(userdata);
    record.password = await bcrypt.hash(record.password, 5);
    db[record.username] = record;
    console.log('yazan',record);
    modulesq.create(record)
      .then(Data => {
        console.log(Data);
      }).catch(e=>{
        console.log(e.message);
      });
    return record;
  }
  return Promise.reject('errorrrrrrrr');
};

users.authenticateBasic = async function (username, password) {
  let valid = await bcrypt.compare(password, db[username].password);
  return valid ? db[username] : Promise.reject();
};

users.generateToken = async function (user) {
  let token = jwt.sign({ username: user.username }, SECRET);
  return token;
};
users.list = async function () {
  let usersdata = await modulesq.read(undefined);
  return usersdata;
};

users.verifyToken = function (token) {
  return jwt.verify(token, SECRET,function(err, decoded) {
    console.log('decode',decoded);
    if (err) {
      console.log('err>>> ', err);
      return Promise.reject(err);
    }
    let username = decoded['username'];
    let usertoken= modulesq.read(username);
    if (usertoken) {
      return Promise.resolve(decoded);
    } 
    return Promise.reject();
  });
};
module.exports = users;