'use strict';

const express = require('express');
const bearer=require('./middleware/bearer-auth');
const morgan = require('morgan');
const app = express();
app.use(express.static('../public'));
app.use(express.json()); // body
app.use(morgan('dev'));
const routeapi=require('./router');
const extraroute=require('./extra-routes');
app.use(extraroute);

app.get('/protected-route', bearer, (req, res)=> {
  res.status(200).json(req.user);
});
app.use(routeapi);
module.exports = {
  server: app,
  start: (port) => {
    app.listen(port, () => { console.log(`Listening on port ${port}`); });
  },
};