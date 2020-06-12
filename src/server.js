'use strict';

const express = require('express');
const morgan = require('morgan');
const app = express();
app.use(express.json());
app.use(morgan('dev'));
const routeapi=require('./auth/router');

app.use(routeapi);



module.exports = {
  server: app,
  start: (port) => {
    app.listen(port, () => { console.log(`Listening on port ${port}`); });
  },
};