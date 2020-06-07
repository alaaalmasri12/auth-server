'use strict';

const mongoose=require('mongoose');
require('dotenv').config();
const bcrypt =  require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET; // place this in your .env
 const usersschema=require('./user-schema');
 const Module=require('./model');
 const modulesq=new Module(usersschema);
console.log(modulesq);


  let db = {};
  
  let users = {};
  
  // TODO For lab 11 : read this link : https://mongoosejs.com/docs/2.7.x/docs/methods-statics.html
  // 1- schema.methods.authenticateBasic .. follow the demo logic.
  
  // save the password as hashed.
  // 2- Mongoose : hooks pre hook. : https://mongoosejs.com/docs/middleware.html#pre
  
  // bcrypt usage so we are doing async function.
  users.save = async function(record) {
      let userdata=await modulesq.read(record.username);
      if (!userdata.length) {
          console.log(userdata);
          record.password  = await bcrypt.hash(record.password, 5);
          db[record.username] = record;
          modulesq.create(record)
          .then(Data=>{
              console.log(Data);
          }) .catch();  
          return record;      
        }
      return Promise.reject();
  }
  
  users.authenticateBasic = async function(username, password) {
      let valid = await bcrypt.compare(password, db[username].password);
      return valid ? db[username] : Promise.reject();
  }
  
  users.generateToken =async function (user) {
      let token = jwt.sign({username: user.username}, SECRET );
      return token;
  }
  users.list= async function () {
      let usersdata=await modulesq.read(undefined);
      return usersdata;
}  
  
  module.exports = users;