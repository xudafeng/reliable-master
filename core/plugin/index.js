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
