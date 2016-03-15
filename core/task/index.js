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

const check = require('./check');
const archive = require('./archive');
const project = require('./project');
const dispatch = require('./dispatch');

exports.run = require('./run');

exports.bind = function() {
  if (cluster.isWorker) {
    cluster.worker.on('message', (e) => {
      switch (e.message) {
        case 'project':
          project();
          break;
        case 'dispatch':
          dispatch();
          break;
        case 'dispatchSuccess':
          dispatch.success(e.data, e.slave);
          break;
        case 'archive':
          archive(e.data);
          break;
        case 'check':
          check(e);
          break;
        case 'slaveReady':
          process._isReady = true;
          break;
      }
    });
  }
};
