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
exports.Plugin = require('./plugin');
exports.Project = require('./project');
exports.Subscribe = require('./subscribe');
