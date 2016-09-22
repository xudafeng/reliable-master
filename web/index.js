'use strict';

require('babel/register')({
  extensions: ['.jsx']
});

const koa = require('koa');
const plugin = require('reliable-plugin');
const EOL = require('os').EOL;

const router = require('./router');
const _ = require('../common/utils/helper');
const middlewares = require('./middlewares');
const auth = require('./middlewares/auth');
const logger = require('../common/utils/logger');
const layout = require('./views/common/layout');
const pluginModel = require('../common/models/').Plugin;

exports.init = (options, callback) => {

  logger.debug('workder init with config:%s %j', EOL, options);

  const app = koa();

  app._options = options;

  middlewares(app);

  plugin(app, {
    pluginModel,
    layout,
    auth,
    registry: options.registry
  });

  router(app);

  app.listen(options.server.port, callback);
};
