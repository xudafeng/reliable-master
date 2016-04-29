'use strict';

const logger = require('../../common/utils/logger');

exports.register = function(app) {
  var plugins = app._options.plugins;

  if (!plugins.length) {
    return;
  }

  plugins.forEach(p => {
    try {
      const plugin = require(p);
      plugin.register(app);
      logger.info(`plugin: ${p} registered`);
    } catch (e) {
      logger.warn(`plugin register failed with: ${e}`);
    }
  });
};
