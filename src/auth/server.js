'use strict';

const express = require('express');
const morgan = require('morgan');
const app = express();
app.use(express.static('../public'));
app.use(express.json()); // body
app.use(morgan('dev'));
// const routeapi=require('./router');
// app.use(routeapi);
module.exports = {
  server: app,
  start: (port) => {
    app.listen(port, () => { console.log(`Listening on port ${port}`); });
  },
};