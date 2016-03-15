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

const Web = require('../web');
const Task = require('../core').Task;

if (cluster.isWorker) {
  cluster.worker.on('message', (e) => {
    switch (e.message) {
      case 'startServer':
        Web.init(e.data, () => {
          Task.bind();
        });
        break;
    }
  });
}
