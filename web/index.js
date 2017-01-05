'use strict';

require('babel/register')({
  extensions: ['.jsx']
});

const EOL = require('os').EOL;
const koa = require('koa');
const plugin = require('reliable-plugin');

const router = require('./router');
const _ = require('../common/utils/helper');
const middlewares = require('./middlewares');
const auth = require('./middlewares/auth');
const logger = require('../common/utils/logger');
const layout = require('./views/common/layout');
const model = require('../common/models/');
const pluginModel = model.Plugin;
const taskModel = model.Task;

exports.init = (options, callback) => {

  logger.debug('workder init with config:%s %j', EOL, options);

  const app = koa();

  app._options = options;

  middlewares(app);

  plugin(app, {
    pluginModel,
    taskModel,
    layout,
    auth
  });

  router(app);

  app.listen(options.server.port, callback);
};
