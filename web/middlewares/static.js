'use strict';

const path = require('path');
const serve = require('koa-static');
const router = require('koa-router');

module.exports = function(app) {
  const p = path.join(__dirname, '..', 'public');
  app.use(serve(p));
  app.use(serve(path.join(p, '3rdparty')));
  return router(app);
};
