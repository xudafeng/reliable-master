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

const cluster = require('cluster');
const mongoose = require('mongoose');

const logger = require('../utils/logger');
const options = require('../config').get();

mongoose.connect(options.database, error => {
  if (error && cluster.isWorker) {
    logger.warn('mongo error: %s', error.message);
    process.send({
      message: 'killMaster'
    });
  }
});

exports.User = require('./user');
exports.Task = require('./task');
exports.Oauth = require('./oauth');
exports.Project = require('./project');
exports.Subscribe = require('./subscribe');
