'use strict';

require('babel/register')({
  extensions: ['.jsx']
});

const EOL = require('os').EOL;
const koa = require('koa');
const plugin = require('reliable-plugin');
const ready = require('ready-callback')();

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

  ready.mixin(app);

  app._options = options;

  middlewares(app);

  const done = app.readyCallback('plugin');

  plugin(app, {
    pluginModel,
    layout,
    auth,
    registry: options.registry,
    done
  });

  router(app);

  app.ready(() => {
    app.listen(options.server.port, callback);
  });
};
