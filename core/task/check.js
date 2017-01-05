'use strict';

const co = require('co');

const models = require('../../common/models');
const _ = require('../../common/utils/helper');
const logger = require('../../common/utils/logger');

const Task = models.Task;
const TIMEOUT = 60; // minutes

module.exports = co.wrap(function *() {
  try {
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

    yield taskQueue;
  } catch(e) {
    logger.warn(e);
    logger.warn('Error when check outdated task');
  }
});
