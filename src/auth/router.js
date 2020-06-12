'use strict';
const express = require('express');
const router = express.Router();
const users = require('../auth/models/user-model');
const basicAuth = require('./middleware/basic');
const oath = require('../auth/middleware/oauth-middleware');
const bearerMiddleware=require('./middleware/bearer-auth');
const acl=require('./middleware/acl-auth-middleware');
const athorize=require('../auth/middleware/authorize');
router.post('/signup', (req, res)=> {
  let user = req.body;
  users.save(user).then(result => {
    let token = users.generateToken(result);
    res.status(200).send(token);
  }).catch(err=> {
    console.log('ERR!!');
    res.status(403).send('Invalid Signup! email is taken');
  });
});

router.get('/secret',bearerMiddleware, (req,res) => {
  res.status(200).json(req.user);
} );
router.post('/signin', basicAuth, (req, res)=> {
  res.send({ token: `${req.token}`,
    // user:req.body
  });
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
router.post('/create',bearerMiddleware, acl('create'), (req, res)=> {
  res.status(201).send('created !! ');
});

router.get('/read', bearerMiddleware, acl('read'), (req, res)=> {
  res.status(200).send('Allowed reading !!');
});
router.put('/update', bearerMiddleware, acl('update'), (req, res)=> {
  res.status(200).send('Allowed updating !!');
});
router.delete('/delete', bearerMiddleware, acl('delete'), (req, res)=> {
  res.status(200).send('allowed deleteing  !!');
});
module.exports = router;
