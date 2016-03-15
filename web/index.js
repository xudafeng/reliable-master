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

const koa = require('koa');
const EOL = require('os').EOL;

const router = require('./router');
const plugins = require('../core/plugin');
const _ = require('../common/utils/helper');
const middlewares = require('./middlewares');
const logger = require('../common/utils/logger');

exports.init = (options, callback) => {

  logger.debug('workder init with config:%s %j', EOL, options);

  const app = koa();

  app._options = options;

  middlewares(app);

  plugins.register(app);

  router(app);

  app.listen(options.server.port, callback);
};
