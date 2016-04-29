
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
