/* ================================================================
 * reliable-master by xdf(xudafeng[at]126.com)
 *
 * first created at : Tue Mar 17 2015 00:16:10 GMT+0800 (CST)
 *
 * ================================================================
 * Copyright xdf
 *
 * Licensed under the MIT License
 * You may not use this file except in compliance with the License.
 *
 * ================================================================ */

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
