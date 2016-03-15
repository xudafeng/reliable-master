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

const co = require('co');

const models = require('../../common/models');
const _ = require('../../common/utils/helper');
const logger = require('../../common/utils/logger');

const Task = models.Task;
const TIMEOUT = 60; // minutes

module.exports = co.wrap(function *() {
  const task = new Task();
  const outDatedTasks = yield task.getOutdatedTasks(TIMEOUT);
  let taskQueue = [];

  outDatedTasks.forEach(data => {
    logger.debug('Task %s is outdated, put it back to task queue.', data._id);
    _.merge(data, {
      status: 0,
      start_at: null,
      extra: '',
      slaveId: '',
      result: []
    });
    taskQueue.push(task.updateById(data._id, data));
  });

  try {
    yield taskQueue;
  } catch(e) {
    logger.warn(e);
    logger.warn('Error when check outdated task');
  }
});
