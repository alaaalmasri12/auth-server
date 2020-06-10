'use strict';
const express = require('express');
const router = express.Router();
const users = require('../auth/models/user-model');
const basicAuth = require('./middleware/basic');
const bearerMiddleware=require('./middleware/bearer-auth');
const oath = require('../auth/middleware/oauth-middleware');
router.post('/signup', (req, res)=> {
  //sign up route if we have the user, return failure, else return generated token.
  let user = req.body;
  users.save(user).then(result => {
    // generate a token and return it.
    let token = users.generateToken(result);
    res.status(200).send(token);
  }).catch(err=> {
    console.log('ERR!!');
    res.status(403).send('Invalid Signup! email is taken');
  });
});


router.post('/signin', basicAuth, (req, res)=> {
  res.send({ token: `${req.token}`,
    user:req.body});
});
router.get('/users',(req, res)=> {
  users.list().then(result => {
    console.log(result);
    res.status(200).send(result);
  }).catch(err=> {
    console.log('ERR!!');
    res.status(403).send('listing error');
  });});

router.get('/oauth',oath, (req, res)=> {
  res.status(200).send(req.token);
});
module.exports = router;


























